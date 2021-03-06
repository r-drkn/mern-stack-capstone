import React, { useContext, useEffect, useReducer } from "react";
import cartReducer from "../context/reducers/cartReducer";

const GlobalCartContext = React.createContext();

export const useCart = () => {
  return useContext(GlobalCartContext);
};

const CartContext = ({ children }) => {
  let localStorageCart = JSON.parse(localStorage.getItem("myCart"));
  if (!localStorageCart) {
    localStorageCart = [];
    localStorage.setItem("myCart", JSON.stringify([]));
  }

  const initialCart = {
    cart: localStorageCart,
    order: null,
    customer: null,
  };
  const [cartState, dispatch] = useReducer(cartReducer, initialCart);

  return (
    <GlobalCartContext.Provider value={{ cartState, dispatch }}>
      {children}
    </GlobalCartContext.Provider>
  );
};
export default CartContext;
