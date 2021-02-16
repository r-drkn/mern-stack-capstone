import { Button } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useQuery } from "react-query";
import { useGlobal } from "../../context/GlobalState";
import { API } from "../../util/fetch";
import useStyles from "./DashboardStyles";

export default function AddRecords(props) {
  const classes = useStyles();
  const globe = useGlobal();
  const { register, handleSubmit, setValue, errors, reset } = useForm();
  const [successfulSubmit, setSuccessfulSubmit] = useState(false);
  const [successfulDelete, setSuccessfulDelete] = useState(false);
  const { editBlogId: blogId, setEditBlogId } = globe;

  const { data: blogInfo, status: blogInfoStatus } = useQuery(
    "blogInfo",
    async () => {
      const { data } = await API.get(`/blog/view/${blogId}`);
      return data;
    }
  );

  useEffect(() => {
    if (blogInfoStatus === "success") {
      console.log(blogInfo[0]);
      const fields = ["title", "byline", "body", "author", "image_str"];
      fields.forEach((field) => setValue(field, blogInfo[0][field]));
    }
  }, [blogInfo, blogInfoStatus, setValue]);

  const handleDelete = async () => {
    try {
      await API.delete(`/blog/delete/${blogId}`);
      showSuccessfulDelete();
      setEditBlogId(null);
      reset();
    } catch (error) {
      console.log(error);
    }
  };

  const submitEditBlog = async (blogEditData) => {
    try {
      await API.post(`/blog/edit/${blogId}`, blogEditData);
      showSuccessfulSubmit();
      reset();
    } catch (error) {
      console.log(error);
    }
  };

  const showSuccessfulSubmit = () => {
    setSuccessfulSubmit(true);
    setTimeout(() => {
      setSuccessfulSubmit(false);
    }, 2000);
  };

  const showSuccessfulDelete = () => {
    setSuccessfulDelete(true);
    setTimeout(() => {
      setSuccessfulDelete(false);
    }, 2000);
  };

  return (
    <div className={classes.componentContainer}>
      <h3 className={classes.formTitle}>Edit Blog</h3>

      <form
        className={classes.formContainer}
        onSubmit={handleSubmit(submitEditBlog)}
        id="editBlogForm"
      >
        <div className={classes.formGroup}>
          <label className={classes.formLabel} htmlFor="title">
            title
          </label>
          <input
            ref={register({ required: true })}
            className={classes.formInput}
            type="text"
            name="title"
          />
          {errors.title && errors.title.type === "required" && (
            <p className={classes.errorMessage}>This is required</p>
          )}
        </div>
        <div className={classes.formGroup}>
          <label className={classes.formLabel} htmlFor="byline">
            byline
          </label>
          <input
            ref={register({ required: true })}
            className={classes.formInput}
            type="text"
            name="byline"
          />
          {errors.byline && errors.byline.type === "required" && (
            <p className={classes.errorMessage}>This is required</p>
          )}
        </div>
        <div className={classes.formGroup}>
          <label className={classes.formLabel} htmlFor="body">
            body
          </label>
          <textarea
            ref={register({ required: true })}
            type="text"
            name="body"
            className={classes.formInput}
            rows={5}
          />
          {errors.body && errors.body.type === "required" && (
            <p className={classes.errorMessage}>This is required</p>
          )}
        </div>
        <div className={classes.formGroup}>
          <label className={classes.formLabel} htmlFor="author">
            author
          </label>
          <input
            ref={register({ required: false })}
            className={classes.formInput}
            type="text"
            name="author"
          />
        </div>

        <div className={classes.formGroup}>
          <label className={classes.formLabel} htmlFor="image_str">
            image url
          </label>
          <input
            ref={register({ required: false })}
            className={classes.formInput}
            type="text"
            name="image_str"
          />
        </div>

        {successfulSubmit && (
          <p className={classes.successfulSubmit}>BLOG EDITED SUCCESSFULLY</p>
        )}
        <input
          className={classes.submitButton}
          type="submit"
          value="Edit Post"
          name="submit"
        />
        {successfulDelete && (
          <p className={classes.successfulSubmit}>BLOG DELETED SUCCESSFULLY</p>
        )}
        <Button className={classes.deleteButton} onClick={() => handleDelete()}>
          Delete Post
        </Button>
      </form>
    </div>
  );
}
