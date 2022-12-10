import { useRef } from "react";
import {
  AiOutlineMinus,
  AiOutlinePlus,
  AiOutlineShopping,
  AiOutlineLeft,
} from "react-icons/ai";
import { TiDeleteOutline } from "react-icons/ti";
import { toast } from "react-hot-toast";
import { useStateContext } from "../context/StateContext";
import Link from "next/link";
import { urlFor } from "../lib/client";
import { currencyFormat } from "../utils";

import { loadStripe } from "@stripe/stripe-js";
import Stripe from "stripe";

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
);

function Cart() {
  const {
    cartItems,
    totalPrice,
    totalQuantities,
    setShowCart,
    quantity,
    decreaseQty,
    increaseQty,
    toggleCartItemQuantity,
    removeFromCart,
  } = useStateContext();
  const cartRef = useRef<HTMLDivElement>(null);

  const handleCheckout = async () => {
    type Session = { session: Stripe.Response<Stripe.Checkout.Session> };

    const stripe = await stripePromise;

    const response = await fetch("/api/stripe", {
      method: "POST",
      body: JSON.stringify(cartItems),
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
    <div className="cart-wrapper" ref={cartRef}>
      <div className="cart-container">
        <button
          type="button"
          className="cart-heading"
          onClick={() => setShowCart && setShowCart(false)}>
          <AiOutlineLeft />
          <span className="heading">Your Cart</span>
          <span className="cart-num-items">({totalQuantities} items)</span>
        </button>

        {cartItems?.length! < 1 && (
          <>
            <div className="empty-cart">
              <AiOutlineShopping size={150} />
              <h3>Your shopping bag is empty</h3>
              <Link href={"/"}>
                <button
                  type="button"
                  className="btn"
                  onClick={() => setShowCart && setShowCart(false)}>
                  Continue shopping
                </button>
              </Link>
            </div>
          </>
        )}

        <div className="product-container">
          {cartItems?.length! >= 1 &&
            cartItems?.map((item, index) => (
              <div className="product" key={item._id}>
                <img
                  src={urlFor(item.image[0]) as unknown as string}
                  className="cart-product-image"
                  alt=""
                />
                <div className="item-desc">
                  <div className="flex top">
                    <h5>{item.name}</h5>
                    <h4>{currencyFormat(item.price)}</h4>
                  </div>
                  <div className="flex bottom">
                    <div className="">
                      <p className="quantity-desc">
                        <span
                          className="minus"
                          onClick={() =>
                            toggleCartItemQuantity &&
                            toggleCartItemQuantity(item._id, "DECREMENT")
                          }>
                          <AiOutlineMinus />
                        </span>
                        <span className="num">{item.quantity}</span>
                        <span
                          className="plus"
                          onClick={() =>
                            toggleCartItemQuantity &&
                            toggleCartItemQuantity(item._id, "INCREMENT")
                          }>
                          <AiOutlinePlus />
                        </span>
                      </p>{" "}
                    </div>
                    <button
                      type="button"
                      className="remove-item"
                      onClick={() =>
                        removeFromCart && removeFromCart(item._id)
                      }>
                      <TiDeleteOutline />
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
        {cartItems?.length! >= 1 && (
          <div
            style={{
              paddingTop: "20px !important",
            }}
            className="cart-bottom">
            <div className="total">
              <h3>Subtotal:</h3>
              <h3>{currencyFormat(totalPrice ?? 0)}</h3>
            </div>
            <div className="btn-container">
              <button type="button" className="btn" onClick={handleCheckout}>
                Pay with stripe
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
