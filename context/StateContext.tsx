import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import { toast } from "react-hot-toast";
import { Product } from "../types";

interface ContextType {
  showCart: boolean;
  cartItems: ProductWithQuantity[];
  totalPrice: number;
  totalQuantities: number;
  quantity: number;
  increaseQty: () => void;
  decreaseQty: () => void;
  addToCart: (p: ProductWithQuantity, q: number) => void;
  setShowCart: Dispatch<SetStateAction<boolean>>;
  toggleCartItemQuantity: (id: string, v: Value) => void;
  removeFromCart: (id: string) => void;
  emptyCart: () => void;
}

interface ProductWithQuantity extends Product {
  quantity: number;
}

type Value = "INCREMENT" | "DECREMENT";

const Context = createContext<Partial<ContextType>>({});

export default function StateContext({ children }: { children: ReactNode }) {
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState<ProductWithQuantity[]>([]);

  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [totalQuantities, setTotalQuantities] = useState<number>(0);
  const [quantity, setQuantity] = useState(1);

  const increaseQty = () => setQuantity((p) => p + 1);
  const decreaseQty = () => setQuantity((p) => (p <= 0 ? 1 : p - 1));

  //   * Add To cart
  const addToCart = (product: ProductWithQuantity, quantity: number) => {
    const exists = cartItems?.find((p) => p._id === product._id);
    setTotalPrice((p) => Number(p) + product.price * quantity);
    setTotalQuantities((p) => Number(p) + quantity);

    if (exists) {
      const updatedCartItems = cartItems.map((item) => {
        if (item._id === product._id)
          return {
            ...item,
            quantity: item.quantity + quantity,
          };

        return { ...item };
      });
      setCartItems(updatedCartItems);
    } else {
      product.quantity = quantity;
      setCartItems([...cartItems, { ...product }]);
    }
    toast.success(`${quantity} ${product.name} added to cart`);
  };

  //   * Update quantity in cart
  const toggleCartItemQuantity = (id: string, value: Value) => {
    const product = cartItems?.find((p) => p._id === id);
    const index = cartItems?.findIndex((p) => p._id === id);

    if (value === "INCREMENT") {
      let newCart = [...cartItems];
      newCart[index] = { ...product!, quantity: product?.quantity! + 1 };

      setTotalPrice((p) => p + product?.price!);
      setTotalQuantities((p) => p + 1);

      setCartItems(newCart);
    } else if (value === "DECREMENT") {
      if (product?.quantity! > 1) {
        let newCart = [...cartItems];
        newCart[index] = { ...product!, quantity: product?.quantity! - 1 };

        setTotalPrice((p) => p - product?.price!);
        setTotalQuantities((p) => p - 1);

        setCartItems(newCart);
      }
    }
  };
  // * Remove from cart
  const removeFromCart = (id: string) => {
    const product = cartItems?.find((p) => p._id === id);
    const index = cartItems?.findIndex((p) => p._id === id);
    console.log("clicked");
    let newCart = [...cartItems];
    newCart.splice(index, 1);

    setTotalPrice((p) => p - product?.price! * product?.quantity!);
    setTotalQuantities((p) => p - product?.quantity!);
    setCartItems(newCart);
  };

  // * Empty cart
  const emptyCart = () => {
    setCartItems([]);
    setTotalPrice(0);
    setTotalQuantities(0);
    setQuantity(1);
  };

  return (
    <Context.Provider
      value={{
        showCart,
        setShowCart,
        cartItems,
        totalPrice,
        totalQuantities,
        quantity,
        increaseQty,
        decreaseQty,
        addToCart,
        toggleCartItemQuantity,
        removeFromCart,
        emptyCart,
      }}>
      {children}
    </Context.Provider>
  );
}

export const useStateContext = () => useContext<Partial<ContextType>>(Context);
