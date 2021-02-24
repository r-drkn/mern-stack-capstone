import React from "react";
import {Fade, makeStyles, Paper } from "@material-ui/core";

const useStyles = makeStyles((theme) => {
  const {
    palette: { primary, secondary },
  } = theme;
  return {
    categoryTitle: {
      width: "100%",
      backgroundColor: secondary.main,
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "center",
      borderRadius: 0,
      marginBottom: "2rem",
      paddingLeft: "1rem",
    },
    titleText: {
      letterSpacing: 3,
      fontWeight: 400,
      color: primary.main,
      margin: 0,
    },
  };
});

export default function TitleBar(props) {
  const classes = useStyles();
  const { title } = props;

  return (
    <>
      <Fade in>
        <Paper className={classes.categoryTitle}>
          <h1 className={classes.titleText}>{title.toLowerCase()}</h1>
        </Paper>
      </Fade>
    </>
  );
}
