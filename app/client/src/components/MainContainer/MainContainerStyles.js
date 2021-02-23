import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => {
  const {
    palette: { primary },
    breakpoints,
  } = theme;

  return {
    root: {
      backgroundColor: primary.main,
      width: "90vw",
      minHeight: "80vh",
      height: "100%",
      display: "flex",
      [breakpoints.only("lg")]: {
        width: "80vw",
      },
      [breakpoints.only("xl")]: {
        width: "70vw",
      },
      margin: "5vh auto",
      borderRadius: 0,
    },
  };
});

export default useStyles;
