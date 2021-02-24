import React, { useState, useEffect } from "react";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/SearchOutlined";
import { TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { API } from "../../util/fetch";
import { useGlobal } from "../../context/GlobalState";
import { Redirect } from "react-router-dom";

const useStyles = makeStyles((theme) => {
  const {
    breakpoints,
    palette: { primary, secondary },
  } = theme;
  return {
    root: {
      height: "1.5rem",
      width: "25vw",
      [breakpoints.only("md")]: {
        width: "30vw",
      },
      [breakpoints.down("sm")]: {
        width: "70vw",
        margin: "auto",
        color: primary.main,
      },
    },
    paper: {
      backgroundColor: secondary.main,
      color: primary.main,
    },
    groupLabel: {
      textTransform: "uppercase",
      textAlign: "center",
      backgroundColor: secondary.main,
      color: "#777",
      margin: "10px auto",
      width: "100%",
      letterSpacing: 2,
      padding: "0.8rem 0rem",
      lineHeight: "normal",
    },
    noOptions: {
      backgroundColor: secondary.main,
      color: primary.main,
    },
    focused: {
      outline: `3px solid ${secondary.main}`,
      borderRadius: "0px",
    },
    searchTextField: {
      backgroundColor: primary.main,
      borderRadius: "none",
      outline: `1px solid ${secondary.main}`,
    },
  };
});

export default function SearchField() {
  const classes = useStyles();
  const [value, setValue] = useState(null);
  const [open, setOpen] = useState(false);
  const [records, setRecords] = useState([]);
  const [redirect, setRedirect] = useState(false);
  const globe = useGlobal();

  const { setSearchQuery, setMenuDrawer } = globe;

  useEffect(() => {
    const getRecords = async () => {
      try {
        const { data } = await API.get("/records/search");
        setRecords(data);
      } catch (error) {
        console.log(error);
      }
    };
    getRecords();
  }, []);

  const cleanedRecords = records.filter((option) => option.title); // filter those options that contain titles

  const options = [
    ...new Map(cleanedRecords.map((option) => [option.title, option])).values(),
  ].sort((a, b) => {
    if (a.group < b.group) {
      return -1;
    }
    if (a.group > b.group) {
      return 1;
    }
    return 0;
  });

  const handleOpen = () => {
    setOpen(true);
  };

  // useEffect(() => {
  //   inputValue.length > 0 ? setOpen(true) : setOpen(false);
  // }, [inputValue]);

  useEffect(() => {
    console.log(value);
    setSearchQuery(value);
    setOpen(false);
  }, [value, setSearchQuery]);

  return (
    <React.Fragment>
      {redirect && <Redirect to="/results" />}

      <div>
        <Autocomplete
          open={open}
          onOpen={handleOpen}
          onClose={() => {
            setOpen(false);
          }}
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
            setRedirect(true);
            setMenuDrawer(false);
          }}
          noOptionsText={"No Results"}
          selectOnFocus
          popupIcon={null}
          classes={{
            root: classes.root,
            groupLabel: classes.groupLabel,
            paper: classes.paper,
            options: classes.options,
            noOptions: classes.noOptions,
            focused: classes.focused,
          }}
          options={options}
          groupBy={(option) => option.group}
          getOptionLabel={(option) => option.title}
          ListboxProps={{
            style: {
              height: "15rem",
              border: "solid 2px white",
              margin: "0px",
            },
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <>
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                    {params.InputProps.startAdornment}
                  </>
                ),
              }}
              placeholder="search..."
              size="small"
              className={classes.searchTextField}
            ></TextField>
          )}
        ></Autocomplete>
      </div>
    </React.Fragment>
  );
}
