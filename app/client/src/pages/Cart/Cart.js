import React, { useState } from "react";
import useStyles from "./CartStyles";
import CartItem from "./CartItem";
import { Card, Box } from "@material-ui/core";
import CartTotals from "./CartTotals";
import { useCart } from "../../context/CartContext";
import Checkout from "./Checkout";
import ShippingDetails from "./ShippingDetails";
import Fade from "react-reveal/Fade";
import { ACTIONS } from "../../context/reducers/cartReducer";
import ButtonMain from "../../components/ButtonMain/ButtonMain";

export default function Cart() {
  const [showCardForm, setShowCardForm] = useState(false);

  const classes = useStyles();
  const {
    cartState: { cart, customer },
    dispatch,
  } = useCart();

  return (
    <Box className={classes.cartContainer}>
      <h1 className={classes.pageTitle}>your cart</h1>
      <Card className={classes.cartItemsContainer}>
        {cart.length <= 0 && (
          <h2 className={classes.noItemsMessage}>
            there's nothing in your cart!
          </h2>
        )}
        {cart.map((cartItem) => {
          return <CartItem key={cartItem.discogs_id} cartItem={cartItem} />;
        })}
      </Card>
      <ShippingDetails />
      <Card className={classes.totalsAndPaymentContainer}>
        <Fade bottom opposite collapse when={!showCardForm}>
          <CartTotals setShowCardForm={setShowCardForm} />
        </Fade>

        <Fade bottom big opposite collapse when={showCardForm}>
          <Checkout
            showCardForm={showCardForm}
            setShowCardForm={setShowCardForm}
            cart={cart}
            customer={customer}
            dispatch={dispatch}
          />
          {/* TODO: style this edit cart button */}
          <ButtonMain
            fullWidth
            onClick={() => {
              dispatch({
                type: ACTIONS.UNSET_ORDER,
              });
              setShowCardForm(!showCardForm);
            }}
          >
            EDIT CART
          </ButtonMain>
        </Fade>
      </Card>
    </Box>
  );
}
