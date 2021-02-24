import React, { useState } from "react";
import Card from "@material-ui/core/Card";
import {
  CardContent,
  Chip,
  IconButton,
  Modal,
  Typography,
  useTheme,
} from "@material-ui/core";
import useStyles from "./RecordModalStyles";
import CartIcon from "../../icons/BoxFull";
import { toCurrencyString } from "../../util/shop";
import { useCart } from "../../context/CartContext";
import { ACTIONS } from "../../context/reducers/cartReducer";
import { useAuth } from "../../context/AuthContext";
import CloseIcon from "@material-ui/icons/Close";
import {
  parseLabelData,
  abbreviateTitle,
} from "../../util/helpers/recordCardHelpers";
import ButtonMain from "../ButtonMain/ButtonMain";
import { API } from "../../util/fetch";
import { Redirect, useHistory } from "react-router-dom";

export default function RecordModal(props) {
  const [successfulDelete, setSuccessfulDelete] = useState(false);
  const [redirectOnDelete, setRedirectOnDelete] = useState(false);
  const classes = useStyles();
  const { dispatch } = useCart();
  const auth = useAuth();
  const theme = useTheme();
  const {
    palette: { red },
  } = theme;
  let history = useHistory();

  const { isSuper } = auth;

  const { recordModalState, setRecordModalState } = props;

  const {
    square_id: recordId,
    release_title: releaseTitle,
    artists_sort: artist,
    styles,
    image,
    labels,
    year,
    description,
    variations: {
      stock: { price },
    },
    preloved,
    tracklist,
  } = props.record;

  const closeClick = () => {
    setRecordModalState(false);
  };

  const deleteRecord = async () => {
    try {
      await API.delete(`/shop/delete/`, { data: { item: recordId } });
      showSuccessfulDelete();
      // setRedirectOnDelete(true);
      history.push("/");
      setRecordModalState(false);
    } catch (error) {
      console.log(error);
    }
  };

  const showSuccessfulDelete = () => {
    setSuccessfulDelete(true);
    setTimeout(() => {
      setSuccessfulDelete(false);
    }, 2000);
  };

  return (
    <div>
      {/* {redirectOnDelete && <Redirect to="/" />} */}
      <Modal
        open={recordModalState}
        className={classes.recordModal}
        onClose={closeClick}
      >
        <Card
          className={classes.recordModalCard}
          style={{
            overflowY: "auto",
            position: "relative",
            paddingTop: "3rem",
          }}
        >
          <IconButton className={classes.closeButton} onClick={closeClick}>
            <CloseIcon />
          </IconButton>
          <div
            style={{
              width: "100%",
              height: "100%",
            }}
          >
            <div
              className={classes.imageContainer}
              style={{
                width: "300px",
                height: "300px",
                position: "relative",
              }}
            >
              <img
                alt="record cover"
                src={image}
                className={classes.coverImage}
              />
              {preloved && (
                <Chip
                  label="pre-loved"
                  size="small"
                  className={classes.preLovedChip}
                />
              )}
              {isSuper() && (
                <Chip label="edit" size="small" className={classes.editChip} />
              )}
            </div>
            <CardContent style={{ position: "relative", padding: "2px" }}>
              <div className={classes.flexedRow}>
                <Typography className={classes.artistName}>
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
              <div className={classes.flexedRow}>
                <Typography className={classes.labelAndYear}>
                  {parseLabelData(labels)} • {year}
                </Typography>
              </div>
              <div className={classes.flexedRow}>
                <Typography className={classes.cardGenres}>
                  {styles.length === 1
                    ? styles[0]
                    : styles[0] + " / " + styles[1]}
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
                    payload: props.record,
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
            {description && (
              <div className={classes.descriptionContainer}>
                <h3 className={classes.infoTitles}>description</h3>
                <p className={classes.description}>{description}</p>
              </div>
            )}

            <div className={classes.trackListContainer}>
              <h3 className={classes.infoTitles}>tracklist</h3>
              {tracklist.map((track) => {
                return (
                  <span
                    key={track.title}
                    className={classes.trackList}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                      padding: 0,
                      margin: 0,
                    }}
                  >
                    <h5>{track.position}</h5>
                    <h5>{track.title}</h5>
                    <h5>{track.duration}</h5>
                  </span>
                );
              })}
            </div>
            {labels.length > 0 && (
              <div className={classes.catalogNumberContainer}>
                <h3 className={classes.infoTitles}>catalog number</h3>
                <p className={classes.catalogNumber}>{labels[0].catno}</p>
              </div>
            )}
            {isSuper() && (
              <React.Fragment>
                {successfulDelete && (
                  <p className={classes.successfulSubmit}>
                    RECORD SUCCESSFULLY DELETED
                  </p>
                )}
                <div
                  style={{
                    padding: "1rem",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <ButtonMain
                    color={red.main}
                    handleClick={() => {
                      deleteRecord();
                    }}
                  >
                    delete
                  </ButtonMain>
                </div>
              </React.Fragment>
            )}
          </div>
        </Card>
      </Modal>
    </div>
  );
}
