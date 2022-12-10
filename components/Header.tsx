import Link from "next/link";
import React from "react";
import { AiOutlineShopping } from "react-icons/ai";
import { useStateContext } from "../context/StateContext";
import Cart from "./Cart";

function Header() {
  const { showCart, setShowCart, totalQuantities } = useStateContext();
  return (
    <div className="navbar-container">
      <p className="logo">
        <Link href={"/"}>Maji Store</Link>
      </p>

      <button
        type="button"
        className="cart-icon"
        onClick={() => setShowCart && setShowCart(!showCart)}>
        <AiOutlineShopping />
        <span className="cart-item-qty">{totalQuantities}</span>
      </button>

      {showCart && <Cart />}
    </div>
  );
}

export default Header;
