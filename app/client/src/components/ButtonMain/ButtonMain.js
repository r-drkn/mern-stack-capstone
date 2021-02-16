import React from "react";
import { Button, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => {
  return {
    button: {
      borderRadius: 0,
      padding: "0.5rem 1rem",
      marginTop: "1rem",
      letterSpacing: "2px",
    },
  };
});

export default function ButtonMain(props) {
  const classes = useStyles();
  const { children, color, handleClick, fullWidth, disabled } = props;
  return (
    <Button
      variant="contained"
      className={classes.button}
      style={{ backgroundColor: `${color}` }}
      onClick={handleClick}
      fullWidth={fullWidth}
      disabled={disabled}
    >
      {children}
    </Button>
  );
}
