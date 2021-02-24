import React from "react";
import { makeStyles, Paper } from "@material-ui/core";

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
      margin: "2rem 0rem",
      paddingLeft: "1rem",
      // outline: `4px double ${primary.main}`,
      // outlineOffset: "-3px",
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
    <Paper className={classes.categoryTitle}>
      <h1 className={classes.titleText}>{title.toLowerCase()}</h1>
    </Paper>
  );
}
