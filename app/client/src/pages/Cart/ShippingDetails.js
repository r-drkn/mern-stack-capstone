import { Card, IconButton, makeStyles } from "@material-ui/core";
import React, { useState, useEffect } from "react";

import { useForm } from "react-hook-form";

import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { API } from "../../util/fetch";
import { ACTIONS } from "../../context/reducers/cartReducer";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { buildCustomer } from "../../util/shop";

const useStyles = makeStyles((theme) => {
  const {
    palette: { light, primary, secondary },
    breakpoints,
  } = theme;
  return {
    formContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      backgroundColor: primary.main,
      padding: "1rem",
      marginBottom: "1rem",
      position: "relative",
    },
    formInput: {
      fontSize: "1rem",
      margin: 0,
    },
    formGroup: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "flex-start",
      margin: "0.5rem",
    },
    submitButton: {
      border: `2px solid ${secondary.main}`,
      borderRadius: 0,
      marginTop: "1rem",
      width: "100%",
      padding: "1rem",
      fontSize: "1rem",
      textTransform: "uppercase",
      fontWeight: "400",
    },
    formLabel: { fontSize: "1rem", color: secondary.main },
    errorMessage: { color: "#ed2e38" },
    formTitle: { margin: 0, padding: 0, width: "100%" },
    successfulSubmit: {
      padding: "0.5rem, 2rem",
      backgroundColor: light.main,
      color: secondary.main,
      border: `2px solid ${secondary.main}`,
    },
    inputPairRow: {
      display: "flex",
      [breakpoints.only("xs")]: {
        flexDirection: "column",
      },
    },
    addressLine1Input: {
      fontSize: "1rem",
      margin: 0,
      width: "100%",
    },
    shippingTopBar: {
      display: "flex",
      justifyContent: "space-between",
      padding: "0",
      width: "100%",
      alignItems: "center",
    },
  };
});

export default function ShippingDetails(props) {
  const classes = useStyles();
  const { currentUser } = useAuth();
  const { register, handleSubmit, errors } = useForm();
  const {
    cartState: { customer },
    dispatch,
  } = useCart();

  const [showShippingForm, setShowShippingForm] = useState(false);
  const [shippingDetails, setShippingDetails] = useState({});
  const [successfulSubmit, setSuccessfulSubmit] = useState(false);

  useEffect(() => {
    const getCurrentShipping = async () => {
      if (customer) {
        const { data } = await API.get(`/customer/${customer}`);
        setShippingDetails(data.customer);
      } else {
        setShippingDetails(null);
      }
    };
    getCurrentShipping();
  }, [customer]);

  const placeHoldShipping = (fieldName) => {
    switch (fieldName) {
      case "first_name":
        return (shippingDetails && shippingDetails.given_name) || "Vinyl";
      case "last_name":
        return (
          (shippingDetails && shippingDetails.family_name) || "Enthusiasts"
        );
      case "phone_number":
        return (
          (shippingDetails && shippingDetails.phone_number) || "0400000000"
        );
      case "address_line_1":
        return (
          (shippingDetails && shippingDetails.address.address_line_1) ||
          "74 Wickham Street"
        );
      case "locality":
        return (
          (shippingDetails && shippingDetails.address.locality) ||
          "Fortitude Valley"
        );
      case "administrative_district_level_1":
        return (
          (shippingDetails &&
            shippingDetails.address.administrative_district_level_1) ||
          "QLD"
        );
      case "postal_code":
        return (
          (shippingDetails && shippingDetails.address.postal_code) || "4006"
        );

      default:
        break;
    }
  };

  const handleShippingSubmit = async (shippingDetails) => {
    const customerObj = buildCustomer(shippingDetails);

    if (currentUser()) {
      customerObj.email_address = currentUser().email;
    } else {
      customerObj.note = "guest customer";
    }

    try {
      if (!shippingDetails.id) {
        const {
          data: { customer },
        } = await API.post("/customer", customerObj);
        dispatch({
          type: ACTIONS.SET_CUSTOMER,
          payload: customer.id,
        });
      } else {
        await API.put(`/customer/${shippingDetails.id}`, customerObj);
      }
      setShowShippingForm(false);
    } catch (e) {
      console.log(e);
      console.log("-----------------------------------------");

      console.log(e.message);
    }
  };

  return (
    <div>
      <Card className={classes.formContainer}>
        <div className={classes.shippingTopBar}>
          <h1 className={classes.formTitle}>
            shipping details
            <span>{customer && <CheckCircleIcon fontSize="large" />}</span>
          </h1>

          {showShippingForm ? (
            <IconButton onClick={() => setShowShippingForm(!showShippingForm)}>
              <ExpandLess />
            </IconButton>
          ) : (
            <IconButton onClick={() => setShowShippingForm(!showShippingForm)}>
              <ExpandMore />
            </IconButton>
          )}
        </div>

        {showShippingForm && (
          <form
            onSubmit={handleSubmit(handleShippingSubmit)}
            id="shippingDetails"
          >
            <div className={classes.inputPairRow}>
              <div className={classes.formGroup}>
                <label className={classes.formLabel} htmlFor="first_name">
                  first name
                </label>
                <input
                  ref={register({ required: true })}
                  className={classes.formInput}
                  type="text"
                  name="first_name"
                  placeholder={placeHoldShipping("first_name")}
                />
                {errors.release_id && errors.release_id.type === "required" && (
                  <p className={classes.errorMessage}>This is required</p>
                )}
              </div>
              <div className={classes.formGroup}>
                <label className={classes.formLabel} htmlFor="last_name">
                  last name
                </label>
                <input
                  ref={register({ required: true })}
                  className={classes.formInput}
                  type="text"
                  name="last_name"
                  placeholder={placeHoldShipping("last_name")}
                />
                {errors.release_id && errors.release_id.type === "required" && (
                  <p className={classes.errorMessage}>This is required</p>
                )}
              </div>
            </div>
            <div className={classes.formGroup}>
              <label className={classes.formLabel} htmlFor="address_line_1">
                address line 1
              </label>
              <input
                ref={register({ required: true })}
                className={classes.addressLine1Input}
                type="text"
                name="address_line_1"
                placeholder={placeHoldShipping("address_line_1")}
              />
              {errors.release_id && errors.release_id.type === "required" && (
                <p className={classes.errorMessage}>This is required</p>
              )}
            </div>

            <div className={classes.inputPairRow}>
              <div className={classes.formGroup}>
                <label className={classes.formLabel} htmlFor="locality">
                  city
                </label>
                <input
                  ref={register({ required: true })}
                  className={classes.formInput}
                  type="text"
                  name="locality"
                  placeholder={placeHoldShipping("locality")}
                />
                {errors.release_id && errors.release_id.type === "required" && (
                  <p className={classes.errorMessage}>This is required</p>
                )}
              </div>
              <div className={classes.formGroup}>
                <label
                  className={classes.formLabel}
                  htmlFor="administrative_district_level_1"
                >
                  state
                </label>
                <input
                  ref={register({ required: true })}
                  className={classes.formInput}
                  type="text"
                  name="administrative_district_level_1"
                  placeholder={placeHoldShipping(
                    "administrative_district_level_1"
                  )}
                />
                {errors.release_id && errors.release_id.type === "required" && (
                  <p className={classes.errorMessage}>This is required</p>
                )}
              </div>
            </div>
            <div className={classes.inputPairRow}>
              <div className={classes.formGroup}>
                <label className={classes.formLabel} htmlFor="postal_code">
                  postcode
                </label>
                <input
                  ref={register({ required: true })}
                  className={classes.formInput}
                  type="text"
                  name="postal_code"
                  placeholder={placeHoldShipping("postal_code")}
                />
                {errors.release_id && errors.release_id.type === "required" && (
                  <p className={classes.errorMessage}>This is required</p>
                )}
              </div>
              <div className={classes.formGroup}>
                <label className={classes.formLabel} htmlFor="phone_number">
                  phone number
                </label>
                <input
                  ref={register({ required: true })}
                  className={classes.formInput}
                  type="text"
                  name="phone_number"
                  placeholder={placeHoldShipping("phone_number")}
                />
                {errors.release_id && errors.release_id.type === "required" && (
                  <p className={classes.errorMessage}>This is required</p>
                )}
              </div>
            </div>
            {successfulSubmit && (
              <p className={classes.successfulSubmit}>
                Record Submitted Successfully
              </p>
            )}
            {/* TODO: syle this bottun with the fluro colour and ripple animation */}
            <input
              className={classes.submitButton}
              type="submit"
              value={
                customer ? "Update Shipping Details" : "Add Shipping Details"
              }
              name="submit"
            />
          </form>
        )}
      </Card>
    </div>
  );
}
