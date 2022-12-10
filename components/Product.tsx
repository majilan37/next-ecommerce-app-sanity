import Link from "next/link";
import React from "react";
import { urlFor } from "../lib/client";
import { Product as ProductType } from "../types";
import { currencyFormat } from "../utils";

function Product({
  product: { name, image, title, price, slug },
}: {
  product: ProductType;
}) {
  return (
    <div>
      <div className="">
        <Link prefetch={true} href={`/product/${slug.current}`}>
          <div className="product-card">
            <img
              src={urlFor(image && image[0]) as unknown as string}
              width={250}
              height={250}
              className="product-image"
              alt=""
            />
            <p className="product-name">{name}</p>
            <p className="product-price">{currencyFormat(price)}</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Product;
