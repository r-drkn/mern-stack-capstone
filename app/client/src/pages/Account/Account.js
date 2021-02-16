import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  List,
  ListItem,
  ListItemText,
  makeStyles,
  useTheme,
} from "@material-ui/core";
import ButtonMain from "../../components/ButtonMain/ButtonMain";
import ShippingDetails from "../Cart/ShippingDetails";
import AccountDetails from "./AccountDetails";

const useStyles = makeStyles((theme) => {
  const {
    palette: { red, primary },
  } = theme;
  return {
    accountsContainer: {
      width: "100%",
      height: "100%",
      backgroundColor: primary.main,
      display: "flex",
      flexDirection: "column",
    },
    navSidebar: {
      width: "20%",
    },
    contentContainer: {
      display: "flex",
    },
  };
});

export default function Account() {
  const auth = useAuth();
  const classes = useStyles();
  const theme = useTheme();
  const [accountComponent, setAccountComponent] = useState("accountDetails");

  const {
    palette: { red },
  } = theme;

  return (
    <div className={classes.accountsContainer}>
      <h1 style={{ padding: "1rem", width: "100%" }}>your account</h1>
      <div className={classes.contentContainer}>
        <List
          className={classes.navSidebar}
          style={{ margin: "1rem", borderRight: "2px solid black" }}
        >
          <ListItem
            button
            onClick={() => setAccountComponent("accountDetails")}
          >
            <ListItemText primary="account details" />
          </ListItem>
          <ListItem
            button
            onClick={() => setAccountComponent("shippingDetails")}
          >
            <ListItemText primary="shipping details" />
          </ListItem>
        </List>
        <div style={{ width: "80%", height: "100%" }}>
          {accountComponent === "accountDetails" && <AccountDetails />}
          {accountComponent === "shippingDetails" && <ShippingDetails />}
        </div>

        {!auth.isAuthenticated() && <Redirect to="/" />}
      </div>
    </div>
  );
}
