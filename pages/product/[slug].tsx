import { GetStaticPaths, GetStaticProps } from "next";
import React, { useState } from "react";
import { client, urlFor } from "../../lib/client";
import { Product as ProductType } from "../../types";
import { currencyFormat } from "../../utils";
import {
  AiOutlineMinus,
  AiOutlinePlus,
  AiFillStar,
  AiOutlineStar,
} from "react-icons/ai";
import { Product } from "../../components";
import { useStateContext } from "../../context/StateContext";
import { loadStripe } from "@stripe/stripe-js";
import Stripe from "stripe";
import { toast } from "react-hot-toast";

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug;

  const [product, products] = await Promise.all([
    client.fetch(`*[_type == "product" && slug.current == "${slug}"][0]`),
    client.fetch(`*[_type == "product"]`),
  ]);

  return {
    props: {
      product,
      products,
    },
  };
};

export const getStaticPaths: GetStaticPaths = async () => {
  type Slug = Promise<Pick<ProductType, "slug">[]>;

  const [slugs] = await Promise.all<Slug>([
    client.fetch(`*[_type == "product"] {
        slug {
            current
        }
    }`),
  ]);

  const paths = slugs.map((slug) => ({
    params: { slug: slug.slug.current },
  }));

  return {
    paths,
    fallback: "blocking",
  };
};

function ProductPage({
  products,
  product: { image: images, Details, price, name, ...rest },
}: {
  products: ProductType[];
  product: ProductType;
}) {
  const [index, setIndex] = useState(0);
  const { decreaseQty, increaseQty, quantity, addToCart, cartItems } =
    useStateContext();
  let image = images;

  const handleCheckout = async () => {
    type Session = { session: Stripe.Response<Stripe.Checkout.Session> };

    const stripe = await stripePromise;

    const response = await fetch("/api/stripe", {
      method: "POST",
      body: JSON.stringify([
        ...(cartItems as (ProductType & { quantity: number })[]),
        {
          image,
          Details,
          price,
          name,
          ...rest,
          quantity: quantity!,
        },
      ]),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 500) return;

    const {
      session: { id },
    }: Session = await response.json();
    id && toast.loading("Redirecting...");

    stripe?.redirectToCheckout({ sessionId: id });
  };

  return (
    <div>
      <div className="product-detail-container">
        <div className="">
          <div className="image-container">
            <img
              src={urlFor(images[index]) as unknown as string}
              className="product-detail-image"
              alt=""
            />
          </div>
          <div className="small-images-container">
            {images.map((image, i) => (
              <img
                key={image._key}
                src={urlFor(image) as unknown as string}
                onMouseEnter={() => setIndex(i)}
                className={`${
                  index === i ? "small-image selected-image" : "small-image"
                }`}
                alt=""
              />
            ))}
          </div>
        </div>
        <div className="product-detail-desc">
          <h1>{name}</h1>
          <div className="reviews">
            <div className="">
              <AiFillStar />
              <AiFillStar />
              <AiFillStar />
              <AiFillStar />
              <AiOutlineStar />
            </div>
            <p>(20)</p>
          </div>
          <h4>Details</h4>
          <p>{Details}</p>
          <p className="price">{currencyFormat(price)}</p>
          <div className="quantity">
            <h3>Quantity</h3>
            <p className="quantity-desc">
              <span className="minus" onClick={decreaseQty}>
                <AiOutlineMinus />
              </span>
              <span className="num" onClick={() => {}}>
                {quantity}
              </span>
              <span className="plus" onClick={increaseQty}>
                <AiOutlinePlus />
              </span>
            </p>
          </div>
          <div className="buttons">
            <button
              type="button"
              className="add-to-cart"
              onClick={() =>
                addToCart &&
                addToCart(
                  { image, Details, price, name, ...rest, quantity: quantity! },
                  quantity!
                )
              }>
              Add to cart
            </button>
            <button type="button" className="buy-now" onClick={handleCheckout}>
              Buy now
            </button>
          </div>
        </div>
      </div>
      <div className="maylike-products-wrapper">
        <h2>You may also like</h2>
        <div className="marquee">
          <div className="maylike-products-container track">
            {products.map((product) => (
              <Product product={product} key={product._id} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
