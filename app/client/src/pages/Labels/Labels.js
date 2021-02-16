import React, { useEffect, useState } from "react";
import { API } from "../../util/fetch";
import { Link } from "react-router-dom";
import { makeStyles, Paper } from "@material-ui/core";
import TitleBar from "../../components/TitleBar/TitleBar";
import ResultsGrid from "../../components/ResultsGrid/ResultsGrid";

const useStyles = makeStyles((theme) => {
  const {
    palette: { primary, secondary, fluro },
    breakpoints,
  } = theme;
  return {
    genresContainer: {
      backgroundColor: primary.main,
      width: "100%",
      height: "100%",
    },
    genresListContainer: {
      width: "100%",
      backgroundColor: primary.main,
      borderRadius: 0,
      padding: "1rem",
      outline: `4px double ${secondary.main}`,
      outlineOffset: "-3px",
    },
    genresList: {
      columnCount: "5",
      [breakpoints.down("md")]: {
        columnCount: "3",
      },
    },
    genreListItem: {
      listStyle: "none",
      fontSize: "1.3rem",
      padding: 0,
      margin: 0,
      textTransform: "lowercase",
      cursor: "pointer",
      "&:hover": {
        fontStyle: "italic",
        borderBottom: `1px solid ${secondary.main}`,
      },
    },
    pageTitle: {
      color: secondary.main,
      marginTop: 0,
      padding: "1rem",
    },
    linkComponent: {
      textDecoration: "none",
    },
  };
});

export default function Labels() {
  const [labelsList, setLabelsList] = useState([]);
  const [label, setLabel] = useState("");
  const [labelStatus, setLabelStatus] = useState("loading");
  const [records, setRecords] = useState([]);

  const classes = useStyles();

  useEffect(() => {
    const getLabels = async () => {
      try {
        const { data } = await API.get("/records/search");
        console.log("data labels:", data);
        const labelsGrep = data
          .filter((obj) => {
            return obj.group === "Labels";
          })
          .map((obj) => obj.title);
        const labels = [...new Set(labelsGrep)];
        console.log(labels);
        setLabelsList(labels);
      } catch (error) {
        console.log(error);
      }
    };
    getLabels();
  }, []);

  useEffect(() => {
    if (label !== "") {
      const getRecords = async () => {
        try {
          const { data } = await API.post("/records/query", {
            category: "labels.name",
            title: label,
          });
          if (data.length > 0) {
            setRecords(data);
          }
          setLabelStatus("success");
        } catch (error) {
          console.log(error);
          setLabelStatus("error");
        }
      };
      getRecords();
    }
  }, [label]);

  return (
    <div className={classes.genresContainer}>
      <Link to="/labels" className={classes.linkComponent}>
        <h1 className={classes.pageTitle}>labels</h1>
      </Link>
      <Paper className={classes.genresListContainer}>
        <ul className={classes.genresList}>
          {labelsList.map((label) => {
            return (
              <li
                className={classes.genreListItem}
                onClick={() => setLabel(label)}
              >
                {label}
              </li>
            );
          })}
        </ul>
      </Paper>
      {label && (
        <React.Fragment>
          <TitleBar title={label} />
          <ResultsGrid query={records} status={labelStatus} />
        </React.Fragment>
      )}
    </div>
  );
}
