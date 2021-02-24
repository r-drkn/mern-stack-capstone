import { makeStyles } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import BoxEmptyDark from "../../icons/BoxEmpty";
import IconButton from "@material-ui/core/IconButton";
import React from "react";
import Toolbar from "@material-ui/core/Toolbar";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import CloseIcon from "@material-ui/icons/Close";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { Link, NavLink } from "react-router-dom";
import BoxFullDark from "../../icons/BoxFull";
import { useCart } from "../../context/CartContext";
import { useGlobal } from "../../context/GlobalState";

const useStyles = makeStyles((theme) => {
  const {
    palette: { primary },
    typography,
    breakpoints,
  } = theme;

  return {
    root: {},
    toolBarDrawer: {
      height: "100%",
      margin: "auto",
      justifyContent: "space-between",
      paddingLeft: "0.5rem",
      paddingRight: "0.5rem",
      width: "90vw",
      maxHeight: "6.25vh",
    },
    closeIcon: {
      fontSize: "2.5rem",
      color: primary.main,
    },
    catalogHeading: {
      fontFamily: typography.fontFamilyCoolvetica,
      fontSize: "2.2rem",
      textDecoration: "none",
      color: primary.main,
      [breakpoints.only("xs")]: {
        fontSize: "1.8rem",
      },
    },
    navIcons: {
      fontSize: "2.5rem",
      color: primary.main,
    },
    cartIconDiv: {
      height: "1rem",
      width: "1rem",
      backgroundColor: "red",
      position: "absolute",
      bottom: 0,
      right: 0,
      borderRadius: "50%",
      "& p": {
        fontSize: "0.7rem",
        color: "white",
        margin: "auto",
      },
    },
    headingContainer: {
      position: "absolute",
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
  };
});

export default function ToolBarMenuDrawer() {
  const classes = useStyles();
  const theme = useTheme();
  const {
    cartState: { cart },
  } = useCart();
  const globe = useGlobal();
  const { setMenuDrawer } = globe;

  const matchTabletOnly = useMediaQuery(theme.breakpoints.only("sm"));

  return (
    <Toolbar className={classes.toolBarDrawer}>
      <div className={classes.headingContainer}>
        <NavLink
          to="/"
          style={{ textDecoration: "none", padding: 0 }}
          onClick={() => setMenuDrawer(false)}
        >
          <h1 className={classes.catalogHeading}>catalogmusic</h1>
        </NavLink>
      </div>
      <IconButton
        edge="start"
        aria-label="menuClose"
        onClick={() => setMenuDrawer(false)}
      >
        <CloseIcon className={classes.closeIcon} />
      </IconButton>

      <div>
        {matchTabletOnly && (
          <Link to="/account">
            <IconButton
              aria-label="account"
              className={classes.accountButton}
              onClick={() => setMenuDrawer(false)}
            >
              <AccountCircleIcon className={classes.navIcons} />
            </IconButton>
          </Link>
        )}
        <Link to="/cart">
          <IconButton
            edge="end"
            aria-label="cart"
            onClick={() => {
              setMenuDrawer(false);
            }}
          >
            {cart.length > 0 ? (
              <div style={{ position: "relative" }}>
                <BoxFullDark className={classes.navIcons} viewBox="0 0 60 60" />
                <div className={classes.cartIconDiv}>
                  <p>{cart.reduce((a, b) => a + b.quantity, 0)}</p>
                </div>
              </div>
            ) : (
              <BoxEmptyDark className={classes.navIcons} viewBox="0 0 60 60" />
            )}
          </IconButton>
        </Link>
      </div>
    </Toolbar>
  );
}
