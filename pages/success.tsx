import Link from "next/link";
import { useState, useEffect } from "react";
import { BsBagCheckFill } from "react-icons/bs";
import { useStateContext } from "../context/StateContext";
import { runFireWorks } from "../utils";

function Success() {
  const { emptyCart } = useStateContext();

  //   * Clear all states
  useEffect(() => {
    localStorage.clear();
    emptyCart && emptyCart();
    runFireWorks();
  }, []);
  return (
    <div className="success-wrapper">
      <div className="success">
        <p className="icon">
          <BsBagCheckFill />
        </p>
        <h2>Thank you for your order!</h2>
        <p className="email-msg">Check your email inbox</p>
        <p className="description">
          If you have any questions, please email{" "}
          <a className="email" href="mailto:order@example.com">
            order@example.com
          </a>
        </p>
        <Link href={"/"}>
          <button
            type="button"
            style={{
              width: "300px",
            }}
            className="btn">
            Continue shopping
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Success;
