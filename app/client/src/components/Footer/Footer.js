import React, { useState } from "react";
import { Link, makeStyles } from "@material-ui/core";
import ContactModal from "../ContactModal/ContactModal";
import CatalogLogo from "../../images/catalog-long-logo.jpg";
const useStyles = makeStyles((theme) => {
  const {
    breakpoints,
    palette: { secondary },
  } = theme;
  return {
    root: {
      display: "flex",
      margin: "auto",
      marginTop: "10vh",
      width: "90vw",
      borderTop: `2px solid ${secondary.light}`,
      paddingBottom: "5vh",
      justifyContent: "flex-end",
      [breakpoints.only("lg")]: {
        width: "80vw",
      },
      [breakpoints.only("xl")]: {
        width: "70vw",
      },
    },
    footerContainer: {
      display: "flex",
      flexDirection: "column",
      margin: "1rem",
      // borderLeft: "2px solid #CDCDCD",
      // paddingLeft: "1rem",
    },
    contactList: {
      listStyle: "none",
      margin: 0,
      padding: 0,
      display: "flex",
      flexDirection: "column",
    },
    addressList: {
      listStyle: "none",
      margin: 0,
      padding: 0,
      "& li": {
        fontSize: "1rem",
        letterSpacing: "1px",
      },
    },
    socialsLinks: {
      fontSize: "1rem",
      color: secondary.main,
      marginBottom: "1rem",
      letterSpacing: "1.5px",
      cursor: "pointer",
    },
    footerHeadings: {
      letterSpacing: "4px",
      color: "#777",
    },
    footerSmallText: {
      fontSize: "0.8rem",
    },
  };
});

export default function Footer() {
  const classes = useStyles();
  const [contactModal, setContactModal] = useState(false);

  return (
    <div className={classes.root}>
      <div
        className={classes.footerContainer}
        style={{
          display: "flex",
          alignItems: "center",
          padding: "2.5rem 0rem",
        }}
      >
        <img
          src={CatalogLogo}
          alt="catalog logo"
          style={{ height: "100px", width: "100%" }}
        ></img>
      </div>
      <div className={classes.footerContainer}>
        <h3 className={classes.footerHeadings}>STORE ADDRESS</h3>
        <ul className={classes.addressList}>
          <li>74 Wickham Street</li>
          <li>Fortitude Valley</li>
          <li>QLD 4006</li>
        </ul>
      </div>
      <div className={classes.footerContainer}>
        <h3 className={classes.footerHeadings} style={{}}>
          SOCIALS
        </h3>
        <Link
          rel="noopener noreferrer"
          target="_blank"
          className={classes.socialsLinks}
          href="https://www.instagram.com/catalogmusic.co/"
          underline="always"
        >
          instagram
        </Link>
        <Link
          rel="noopener noreferrer"
          target="_blank"
          className={classes.socialsLinks}
          href="https://www.facebook.com/catalogrecordstore/"
          underline="always"
        >
          facebook
        </Link>
      </div>
      <div className={classes.footerContainer}>
        <h3 className={classes.footerHeadings}>CONTACT</h3>
        <Link
          component="a"
          className={classes.socialsLinks}
          onClick={() => setContactModal(true)}
          underline="always"
        >
          message us!
        </Link>
        <ContactModal
          contactModal={contactModal}
          setContactModal={setContactModal}
        ></ContactModal>
        <h3 className={classes.footerHeadings}>EMAIL</h3>
        <span>hey@catalogmusic.com</span>
      </div>
    </div>
  );
}
