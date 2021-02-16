import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => {
  const {
    palette: { red, fluro, primary, secondary },
    breakpoints,
  } = theme;
  return {
    modal: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    successMessage: {
      width: "100%",
      margin: "3rem",
      fontSize: "1.5rem",
      color: primary.main,
      borderBottom: `4px double ${fluro.main}`,
    },
    card: {
      padding: "2rem",
      display: "flex",
      justifyContent: "center",
      position: "relative",
      borderRadius: "0px",
      border: `3px solid ${primary.main}`,
      backgroundColor: secondary.main,
      [breakpoints.only("sm")]: {
        padding: "2rem 3rem",
      },
      [breakpoints.up("md")]: {
        padding: "2rem 5rem",
      },
    },
    formTitle: {
      marginBottom: "0px",
      color: primary.main,
    },
    closeButton: {
      position: "absolute",
      top: 0,
      left: 0,
      color: primary.main,
    },
    formContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    formInput: {
      height: "2rem",
      fontSize: "1rem",
    },

    formGroup: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "flex-start",
      margin: "1rem",
    },
    submitButton: {
      border: "1px solid black",
      margin: "0rem 1rem 1rem",
      color: secondary.main,
      padding: "0.5rem 1rem",
      backgroundColor: primary.main,
      fontSize: "1rem",
    },
    formLabel: { fontSize: "1rem", color: primary.main },
    errorMessage: {
      color: red.main,
    },
    bottomLinks: {
      color: primary.main,
      fontSize: "1rem",
      textDecoration: "underline",
      padding: "0.5rem 1rem",
    },
    signUpMessage: { color: primary.main },
  };
});
export default useStyles;
