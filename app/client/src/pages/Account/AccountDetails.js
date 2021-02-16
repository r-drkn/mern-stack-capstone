import { makeStyles, useTheme } from "@material-ui/core";
import React from "react";
import ButtonMain from "../../components/ButtonMain/ButtonMain";
import { useAuth } from "../../context/AuthContext";

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

  console.log(auth.authState);

  const {
    palette: { red },
  } = theme;

  const handleLogout = () => {
    auth.logUserOut();
  };
  return (
    <div className={classes.detailsContainer}>
      <h3>username: {username}</h3>
      <h3>email: {email}</h3>
      <ButtonMain color={red.main} handleClick={handleLogout}>
        logout
      </ButtonMain>
    </div>
  );
}
