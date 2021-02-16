import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => {
  const {
    palette: { red, fluro, primary, secondary },
    breakpoints,
  } = theme;
  return {
    recordModal: {
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
    recordModalCard: {
      padding: "1rem",
      display: "flex",
      justifyContent: "center",
      flexDirection: "column",
      position: "relative",
      borderRadius: "0px",
      border: `3px solid ${secondary.main}`,
      backgroundColor: primary.main,
      height: "80vh",
      [breakpoints.only("xs")]: {
        padding: "3rem 1.5rem",
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
      color: secondary.main,
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
    },
    signUpMessage: { color: primary.main },
    coverImage: {
      width: "100%",
    },
    imageContainer: {
      width: "300px",
      height: "300px",
      [breakpoints.only("xs")]: { width: "80%" },
    },
    artistName: { margin: "0px", fontSize: "14px" },
    recordPrice: { fontSize: "14px", marginRight: "0.5rem" },
    recordTitle: { fontSize: "12px" },
    labelAndYear: { fontSize: "12px", color: "#808080" },
    cardGenres: { textTransform: "uppercase", fontSize: "10px" },

    flexedRow: {
      display: "flex",
      justifyContent: "space-between",
      padding: "0px",
    },
    recordDescription: {
      position: "absolute",
      top: 0,
      left: 0,
      padding: "0.5rem",
      textAlign: "justify",
      cursor: "pointer",
      margin: 0,
      color: secondary.main,
      fontSize: "1rem",
    },
    descriptionContainer: {
      paddingTop: "1rem",
    },
    description: {
      fontStyle: "italic",
    },
    iconContainer: {
      display: "flex",
      flexDirection: "column",
    },
    cartIcon: {
      fontSize: "1.5rem",
    },
    addIcon: {
      fontSize: "0.5rem",
      color: secondary.main,
    },
    preLovedChip: {
      color: secondary.main,
      backgroundColor: fluro.main,
      position: "absolute",
      bottom: 0,
      right: 0,
      margin: "1rem 0.5rem",
    },
    editChip: {
      color: secondary.main,
      position: "absolute",
      bottom: 0,
      left: 0,
      margin: "1rem 0.5rem",
    },
    trackListContainer: { width: "100%", padding: "1rem 0rem" },
    infoTitles: {
      letterSpacing: "3px",
      fontWeight: "200",
      width: "100%",
      textAlign: "center",
    },
    catalogNumber: {
      textAlign: "center",
    },
    successfulSubmit: {
      padding: "0.5rem",
      backgroundColor: fluro.main,
      color: secondary.main,
      borderRadius: "5px",
      margin: "auto",
      textAlign: "center",
      fontSize: "0.8rem",
    },
  };
});
export default useStyles;
