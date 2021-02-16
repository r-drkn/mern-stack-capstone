import React, { useState } from "react";
import Card from "@material-ui/core/Card";
import {
  Box,
  CardContent,
  Chip,
  IconButton,
  Typography,
} from "@material-ui/core";
import useStyles from "./RecordCardStyles";
import CartIcon from "../../icons/BoxFull";
import { toCurrencyString } from "../../util/shop";
import { useCart } from "../../context/CartContext";
import { ACTIONS } from "../../context/reducers/cartReducer";
import { useAuth } from "../../context/AuthContext";
import { useGlobal } from "../../context/GlobalState";
import RecordModal from "../RecordModal/RecordModal";
import { Redirect } from "react-router-dom";
import {
  parseLabelData,
  abbreviateTitle,
} from "../../util/helpers/recordCardHelpers";

export default function RecordCard(props) {
  const classes = useStyles();
  const { dispatch } = useCart();
  const auth = useAuth();
  const { record } = props;
  const { isSuper } = auth;
  const {
    release_title: releaseTitle,
    artists_sort: artist,
    styles,
    image,
    labels,
    year,
    review,
    variations: {
      stock: { price },
    },
    preloved,
  } = record;
  const globe = useGlobal();
  const { setEditRecordId, setSearchQuery } = globe;
  const [recordModalState, setRecordModalState] = useState(false);
  const [blur, setBlur] = useState("blur(0px)");
  const [display, setDisplay] = useState("none");
  const [editRedirect, setEditRedirect] = useState(false);
  const [resultsRedirect, setResultsRedirect] = useState(false);

  const handleHover = (blurState, displayState) => {
    if (review.length > 0) {
      setBlur(blurState);

      setTimeout(() => {
        setDisplay(displayState);
      }, 300);
    }
  };

  const resultsClick = (group, title) => {
    const value = { group: group, title: title };
    setSearchQuery(value);
    setResultsRedirect(true);
  };

  const handleEditClick = () => {
    setEditRecordId(record._id);
    setEditRedirect(true);
  };

  return (
    <div>
      <Card className={classes.card} raised>
        {editRedirect && <Redirect to="/dashboard" />}
        {resultsRedirect && <Redirect to="/results" />}

        {recordModalState && (
          <RecordModal
            record={record}
            recordModalState={recordModalState}
            setRecordModalState={setRecordModalState}
          />
        )}
        <Box
          onMouseEnter={() => handleHover("blur(50px)", "block")}
          onMouseLeave={() => handleHover("blur(0px)", "none")}
          style={{ position: "relative" }}
        >
          <img
            alt="record cover"
            src={image}
            className={classes.coverImage}
            style={{
              filter: blur,
              transition: "0.5s filter",
            }}
          />

          {blur && (
            <p
              className={classes.recordReview}
              style={{
                display: display,
              }}
            >
              {review}
            </p>
          )}
          {preloved && (
            <Chip
              label="pre-loved"
              size="small"
              className={classes.preLovedChip}
              onClick={() => resultsClick("preloved", true)}
            />
          )}
          {isSuper() && (
            <Chip
              label="edit"
              size="small"
              className={classes.editChip}
              onClick={() => handleEditClick()}
            />
          )}
          <Chip
            label="more info"
            size="small"
            className={classes.moreInfoChip}
            onClick={() => setRecordModalState(true)}
          />
        </Box>
        <CardContent style={{ position: "relative", padding: "2px" }}>
          <div className={classes.flexedRow}>
            <Typography
              className={classes.artistName}
              onClick={() => resultsClick("artists", artist)}
            >
              {abbreviateTitle(artist, 18)}
            </Typography>
            <Typography className={classes.recordPrice}>
              ${toCurrencyString(price)}
            </Typography>
          </div>
          <div className={classes.flexedRow}>
            <Typography className={classes.recordTitle}>
              {abbreviateTitle(releaseTitle, 21)}
            </Typography>
          </div>
          <div className={classes.labelAndYearRow}>
            <Typography className={classes.labelAndYear}>
              {parseLabelData(labels) + " • "}
            </Typography>
            <Typography
              className={classes.labelAndYear}
              onClick={() => resultsClick("year", year)}
            >
              {year}
            </Typography>
          </div>
          <div className={classes.flexedRow}>
            <Typography className={classes.cardGenres}>
              {styles.length === 1 ? styles[0] : styles[0] + " / " + styles[1]}
            </Typography>
          </div>
          <IconButton
            edge="end"
            style={{
              position: "absolute",
              bottom: -4,
              right: 8,
            }}
            onClick={() => {
              dispatch({
                type: ACTIONS.ADD_RECORD,
                payload: record,
              });
            }}
          >
            <div className={classes.iconContainer}>
              <span className={classes.addIcon}>ADD</span>
              <CartIcon
                className={classes.cartIcon}
                color="secondary"
                viewBox="0 0 60 60"
              />
            </div>
          </IconButton>
        </CardContent>
      </Card>
    </div>
  );
}
