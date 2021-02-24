// extend search bar down as much as possible

import React, { useState } from "react";
import Drawer from "@material-ui/core/Drawer";
import {
  Divider,
  Fade,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { makeStyles } from "@material-ui/core";
import SearchField from "./SearchField";
import { Link } from "react-router-dom";
import { useGlobal } from "../../context/GlobalState";
import { useAuth } from "../../context/AuthContext";
import ToolBarMenuDrawer from "./ToolBarMenuDrawer";

const useStyles = makeStyles((theme) => {
  const {
    palette: { primary, secondary },
  } = theme;

  return {
    root: { backgroundColor: secondary.main },
    menuIcon: {
      fontSize: "2.5rem",
      color: secondary.main,
    },
    searchListItem: {
      padding: 0,
      width: "100vw",
      display: "flex",
      justifyContent: "center",
      margin: "2rem 0px 1rem 0px",
    },
    paper: {
      height: "100vh",
      width: "100vw",
      backgroundColor: secondary.main,
      color: primary.main,
    },
    listItems: {
      height: "4rem",
    },
    listItemText: {
      fontSize: "2rem",
    },
    genresItemText: {
      marginLeft: "5rem",
    },
    divider: {
      width: "90vw",
      margin: "1rem auto 0px auto",
      background: primary.main,
    },
    toolBarContainer: {
      borderBottom: `3px solid ${primary.main}`,
      boxShadow: `0px 3px 2px -2px ${primary.main}`,
      width: "90vw",
      margin: "auto",
      padding: "0px",
    },
  };
});

export default function MenuDrawer() {
  const classes = useStyles();
  const globe = useGlobal();
  const auth = useAuth();
  const { menuDrawer, setMenuDrawer } = globe;

  const ListItemLink = function (props) {
    const { onClick, primary, to } = props;

    const CustomLink = React.useMemo(
      () =>
        React.forwardRef((linkProps, ref) => (
          <Link ref={ref} to={to} {...linkProps} />
        )),
      [to]
    );

    return (
      <li>
        <ListItem
          className={classes.listItems}
          button
          component={CustomLink}
          onClick={onClick}
        >
          <ListItemText
            classes={{ primary: classes.listItemText }}
            inset={true}
            primary={primary}
          />
        </ListItem>
      </li>
    );
  };

  return (
    <React.Fragment>
      <IconButton
        aria-label="menu"
        edge="start"
        onClick={() => {
          setMenuDrawer(!menuDrawer);
        }}
      >
        <MenuIcon className={classes.menuIcon} />
      </IconButton>
      <Drawer
        className={classes.root}
        variant="temporary"
        open={menuDrawer}
        classes={{ paper: classes.paper }}
      >
        <Fade in timeout={1000}>
          <List style={{ padding: "0px" }}>
            <ListItem
              className={classes.toolBarContainer}
              key="toolBarContainer"
            >
              <ToolBarMenuDrawer />
            </ListItem>
            <ListItem
              className={classes.searchListItem}
              alignItems="center"
              key="searchListItem"
            >
              <SearchField />
            </ListItem>
            {auth.authState ? (
              <ListItemLink
                to="/account"
                primary="my account"
                onClick={() => setMenuDrawer(false)}
              />
            ) : (
              <ListItemLink
                to=""
                primary="log in"
                onClick={() => globe.setLoginModalState(true)}
              />
            )}

            <ListItemLink
              to="/new"
              primary="new stock"
              onClick={() => setMenuDrawer(false)}
            />

            <ListItemLink
              to="/labels"
              primary="labels"
              onClick={() => setMenuDrawer(false)}
            />

            <ListItemLink
              to="/genres"
              primary="genres"
              onClick={() => setMenuDrawer(false)}
            />

            <ListItemLink
              to="/news"
              primary="news"
              onClick={() => setMenuDrawer(false)}
            />

            <Divider className={classes.divider} classes={classes.light} />
            <ListItem>
              <ListItemText inset={true}>catalog music 2021</ListItemText>
            </ListItem>
          </List>
        </Fade>
      </Drawer>
    </React.Fragment>
  );
}
