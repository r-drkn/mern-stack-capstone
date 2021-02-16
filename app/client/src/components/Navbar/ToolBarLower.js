import { Link, NavLink } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";
import SearchField from "./SearchField";
import Toolbar from "@material-ui/core/Toolbar";

const useStyles = makeStyles((theme) => {
  const {
    palette: { fluro, secondary },
    breakpoints,
  } = theme;

  return {
    toolBarLower: {
      [breakpoints.down("sm")]: {
        display: "none",
      },
      justifyContent: "space-between",
    },
    navLinks: {
      color: secondary.main,
      fontSize: "1.25rem",
      letterSpacing: 1,
      marginRight: "3vw",
      textDecoration: "none",
      cursor: "pointer",
      "&:hover": {
        textDecoration: "none",
        borderTop: `3px solid ${fluro.main}`,
        borderBottom: `3px solid ${fluro.main}`,
      },
    },
    selected: {
      textDecoration: "none",
      borderTop: `3px solid ${fluro.main}`,
      borderBottom: `3px solid ${fluro.main}`,
    },
  };
});

export default function ToolBarLower() {
  const classes = useStyles();

  return (
    <Toolbar className={classes.toolBarLower}>
      <div>
        <NavLink
          to="/newstock"
          className={classes.navLinks}
          activeClassName={classes.selected}
        >
          new stock
        </NavLink>
        <NavLink
          to="/labels"
          className={classes.navLinks}
          activeClassName={classes.selected}
        >
          labels
        </NavLink>
        <NavLink
          to="/genres"
          className={classes.navLinks}
          activeClassName={classes.selected}
        >
          genres
        </NavLink>
        <NavLink
          to="/news"
          className={classes.navLinks}
          activeClassName={classes.selected}
        >
          news
        </NavLink>
      </div>
      <SearchField />
    </Toolbar>
  );
}
