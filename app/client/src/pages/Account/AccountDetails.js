import { makeStyles, useTheme } from "@material-ui/core";
import React, { useState } from "react";
import ButtonMain from "../../components/ButtonMain/ButtonMain";
import { useAuth } from "../../context/AuthContext";
import { Redirect } from "react-router-dom";

const useStyles = makeStyles((theme) => {
  const {
    palette: { red, primary },
  } = theme;
  return {
    detailsContainer: {
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      padding: "1rem",
    },
  };
});

export default function AccountDetails() {
  const auth = useAuth();
  const classes = useStyles();
  const theme = useTheme();

  const { username, email } = auth.authState;
  const [logoutRedirect, setLogoutRedirect] = useState(false);

  const handleLogout = () => {
    auth.logUserOut();
    setLogoutRedirect(true);
  };

  const {
    palette: { red },
  } = theme;

  return (
    <div className={classes.detailsContainer}>
      {logoutRedirect && <Redirect to="/" />}
      <h3>username: {username}</h3>
      <h3>email: {email}</h3>
      <ButtonMain color={red.main} handleClick={handleLogout}>
        logout
      </ButtonMain>
    </div>
  );
}
