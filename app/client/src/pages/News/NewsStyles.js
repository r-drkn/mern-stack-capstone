import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => {
  const {
    breakpoints,
    palette: { fluro, primary, secondary },
  } = theme;

  return {
    newsContainer: {
      width: "100%",
      paddingBottom: "5vh",
    },
    pageTitle: {
      color: secondary.main,
      margin: "1rem",
    },
    imageContainer: {
      margin: "auto",
      width: "100%",
      padding: "3rem 1rem",
      backgroundColor: primary.main,
      borderRadius: 0,
      position: "relative",
      [breakpoints.up("lg")]: {
        height: "20vw",
      },
    },
    heroPost: {
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
    heroTitle: {
      margin: 0,
      backgroundColor: primary.main,
      padding: "0rem 2rem",
      border: "4px double black",
      letterSpacing: "4px",
    },
    heroByline: {
      backgroundColor: primary.main,
      padding: "0rem 0.5rem",
      border: "4px double black",
      textAlign: "center",
      [breakpoints.up("lg")]: {
        maxWidth: "50%",
      },
    },
    heroDate: {
      backgroundColor: primary.main,
      padding: "0 0.5rem",
      border: "4px double black",
    },

    newsCard: {
      backgroundColor: primary.main,
      borderRadius: 0,
    },
    newsCardContent: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
    cardTitle: {
      margin: "0.5rem",
      backgroundColor: secondary.main,
      padding: "0rem 2rem",
      border: "4px double #eee",
      letterSpacing: "2px",
      color: primary.main,
    },
    cardDate: {
      margin: "0.2rem",
      backgroundColor: primary.main,
      padding: "0rem 0.5rem",
      border: "4px double black",
    },
    cardByline: {
      margin: "0.5rem",
      backgroundColor: primary.main,
      padding: "0rem 0.5rem",
      border: "4px double black",
    },
    editChip: {
      backgroundColor: fluro.main,
      padding: "0rem 1rem",
    },
    moreIconContainer: {
      backgroundColor: primary.main,
    },
    lessIconContainer: {
      backgroundColor: secondary.main,
    },
    bodyContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "2rem",
      background: primary.main,
    },
    cardActionsContainer: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
  };
});

export default useStyles;
