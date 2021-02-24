import { makeStyles } from "@material-ui/core";
import { Link, NavLink } from "react-router-dom";
import { Link as MuiLink } from "@material-ui/core/";
import { useTheme } from "@material-ui/core/styles";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import BoxEmptyDark from "../../icons/BoxEmpty";
import IconButton from "@material-ui/core/IconButton";
import React from "react";
import Toolbar from "@material-ui/core/Toolbar";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import MenuDrawer from "./MenuDrawer";
import LoginModal from "../LoginModal/LoginModal";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import { useCart } from "../../context/CartContext";
import BoxFullDark from "../../icons/BoxFull";
import { useAuth } from "../../context/AuthContext";
import { useGlobal } from "../../context/GlobalState";

const useStyles = makeStyles((theme) => {
  const {
    palette: { secondary },
    typography,
    breakpoints,
  } = theme;

  return {
    toolBarUpper: {
      position: "relative",
      maxHeight: "5vh",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "0rem 0.5rem",
    },
    navIcons: {
      fontSize: "2.5rem",
      color: secondary.main,
    },
    catalogHeading: {
      fontFamily: typography.fontFamilyCoolvetica,
      fontSize: "2.2rem",
      color: secondary.main,
      textDecoration: "none",
      display: "flex",
      alignItems: "center",
      margin: 0,
      padding: 0,
      [breakpoints.only("xs")]: {
        fontSize: "1.8rem",
      },
    },
    navLinks: {
      color: secondary.main,
      display: "inline-block",
      cursor: "pointer",
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

export default function ToolBarUpper() {
  const classes = useStyles();
  const theme = useTheme();
  const auth = useAuth();
  const globe = useGlobal();

  const {
    cartState: { cart },
  } = useCart();

  const matchTabletDown = useMediaQuery(theme.breakpoints.down("sm"));
  const matchTabletUp = useMediaQuery(theme.breakpoints.up("sm"));
  const matchDesktopUp = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <Toolbar className={classes.toolBarUpper}>
      <div
        className={
          matchDesktopUp
            ? classes.desktopHeadingContainer
            : classes.headingContainer
        }
      >
        <NavLink to="/" style={{ textDecoration: "none", padding: 0 }}>
          <h1 className={classes.catalogHeading}>catalogmusic</h1>
        </NavLink>
      </div>
      {matchTabletDown && <MenuDrawer />}

      <div>
        <React.Fragment>
          {(auth.isSuper() || auth.isAdmin()) && (
            <Link to="/dashboard">
              {matchDesktopUp && (
                <h2 className={classes.navLinks}>dashboard</h2>
              )}
              {matchTabletUp && (
                <IconButton
                  aria-label="dashboard"
                  className={classes.accountButton}
                >
                  <SupervisorAccountIcon
                    color="secondary"
                    className={classes.navIcons}
                  />
                </IconButton>
              )}
            </Link>
          )}
          {auth.authState ? (
            <Link to="/account">
              {matchDesktopUp && (
                <h2 className={classes.navLinks}>my account</h2>
              )}
              {matchTabletUp && (
                <IconButton
                  aria-label="account"
                  className={classes.accountButton}
                >
                  <AccountCircleIcon
                    color="secondary"
                    className={classes.navIcons}
                  />
                </IconButton>
              )}
            </Link>
          ) : (
            <MuiLink
              onClick={() => {
                globe.setLoginModalState(true);
              }}
            >
              {matchDesktopUp && <h2 className={classes.navLinks}>log in</h2>}
              {matchTabletUp && (
                <IconButton
                  aria-label="account"
                  className={classes.accountButton}
                >
                  <AccountCircleIcon
                    color="secondary"
                    className={classes.navIcons}
                  />
                </IconButton>
              )}
            </MuiLink>
          )}
          <Link to="/cart">
            {matchDesktopUp && <h2 className={classes.navLinks}>cart</h2>}

            <IconButton edge="end" aria-label="cart">
              {cart.length > 0 ? (
                <div style={{ position: "relative" }}>
                  <BoxFullDark
                    className={classes.navIcons}
                    viewBox="0 0 60 60"
                  />
                  <div className={classes.cartIconDiv}>
                    <p>{cart.reduce((a, b) => a + b.quantity, 0)}</p>
                  </div>
                </div>
              ) : (
                <BoxEmptyDark
                  className={classes.navIcons}
                  viewBox="0 0 60 60"
                />
              )}
            </IconButton>
          </Link>
        </React.Fragment>
        <LoginModal />
      </div>
    </Toolbar>
  );
}
