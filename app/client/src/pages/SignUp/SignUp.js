import React, { useState } from "react";
import { Link } from "@material-ui/core/";
import { useForm } from "react-hook-form";
import useStyles from "./SignUpStyles";
import { API } from "../../util/fetch";
import { Redirect } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useGlobal } from "../../context/GlobalState";

export default function SignUp({ userData }) {
  const classes = useStyles();
  const auth = useAuth();
  const globe = useGlobal();
  const { register, handleSubmit, getValues, errors, setError } = useForm();
  const [redirectOnLogin, setRedirectOnLogin] = useState(false);

  const submitSignupInfo = async (userInfo) => {
    try {
      const { data: userData } = await API.post("/auth/signup", userInfo);
      console.log(userData);
      // send user object to auth
      auth.setAuthState(userData);
      setRedirectOnLogin(true);
    } catch (error) {
      if (error.response) {
        console.error(error.response.data.formError);
        const { name, type, message } = error.response.data.formError;
        setError(name, { type, message });
      }
    }
  };

  return (
    <React.Fragment>
      {redirectOnLogin && <Redirect to="/" />}
      <div className={classes.signUpContainer}>
        <div className={classes.formContainer}>
          <h1 className={classes.formTitle}>sign up</h1>
          {/* <p>{signupSuccess}</p> */}
          <form onSubmit={handleSubmit(submitSignupInfo)} id="signUpForm">
            <div className={classes.formGroup}>
              <label className={classes.formLabel} htmlFor="username">
                username
              </label>
              <input
                ref={register({ required: true })}
                className={classes.formInput}
                type="text"
                name="username"
              />
              {errors.username && errors.username.type === "required" && (
                <p role="alert" className={classes.errorMessage}>
                  This is required
                </p>
              )}
              {errors.username && errors.username.type === "manual" && (
                <p role="alert" className={classes.errorMessage}>
                  {errors.username.message}
                </p>
              )}
            </div>

            <div className={classes.formGroup}>
              <label className={classes.formLabel} htmlFor="email">
                email
              </label>
              <input
                ref={register({ required: true })}
                className={classes.formInput}
                type="email"
                name="email"
              />
              {errors.email && errors.email.type === "required" && (
                <p role="alert" className={classes.errorMessage}>
                  This is required
                </p>
              )}
              {errors.email && errors.email.type === "manual" && (
                <p role="alert" className={classes.errorMessage}>
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className={classes.formGroup}>
              <label className={classes.formLabel} htmlFor="password">
                password
              </label>
              <input
                ref={register({ required: true, minLength: 7 })}
                type="password"
                name="password"
                className={classes.formInput}
              />{" "}
              {errors.password && errors.password.type === "required" && (
                <p role="alert" className={classes.errorMessage}>
                  This is required
                </p>
              )}
              {errors.password && errors.password.type === "minLength" && (
                <p role="alert" className={classes.errorMessage}>
                  Minimum 7 characters
                </p>
              )}
            </div>

            <div className={classes.formGroup}>
              <label className={classes.formLabel} htmlFor="confirmPassword">
                confirm password
              </label>
              <input
                ref={register({
                  validate: (value) =>
                    value === getValues("password") ? (
                      true
                    ) : (
                      <p>Passwords don't match</p>
                    ),
                  required: true,
                  minLength: 7,
                })}
                type="password"
                name="confirmPassword"
                className={classes.formInput}
              />
              {errors.password && errors.password.type === "required" && (
                <p role="alert" className={classes.errorMessage}>
                  This is required
                </p>
              )}
              {errors.password && errors.password.type === "minLength" && (
                <p role="alert" className={classes.errorMessage}>
                  Minimum 7 characters
                </p>
              )}
            </div>

            <input
              className={classes.submitButton}
              type="submit"
              value="Create Account"
              name="submit"
            />
          </form>
          <p className={classes.signUpMessage}>
            Already have an account?
            <Link
              to={"/login"}
              className={classes.bottomLinks}
              color="secondary"
              onClick={() => globe.setModalState(true)}
            >
              Log In
            </Link>
          </p>
        </div>
      </div>
    </React.Fragment>
  );
}
