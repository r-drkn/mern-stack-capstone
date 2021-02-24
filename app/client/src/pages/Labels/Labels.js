import React, { useEffect, useMemo, useState } from "react";
import { API } from "../../util/fetch";
import { Link } from "react-router-dom";
import { IconButton, makeStyles, Paper, useTheme } from "@material-ui/core";
import TitleBar from "../../components/TitleBar/TitleBar";
import ResultsGrid from "../../components/ResultsGrid/ResultsGrid";

const useStyles = makeStyles((theme) => {
  const {
    palette: { primary, secondary },
    breakpoints,
  } = theme;

  return {
    labelsContainer: {
      backgroundColor: primary.main,
      width: "100%",
      height: "100%",
    },
    labelsListContainer: {
      backgroundColor: primary.main,
      borderRadius: 0,
      padding: "1rem",
      border: `4px double ${secondary.main}`,
      width: "100%",
      marginBottom: "2rem",
    },
    labelsList: {
      display: "flex",
      justifyContent: "space-evenly",
      padding: "1rem 0rem 2rem 0rem",
      [breakpoints.down("sm")]: {
        justifyContent: "space-between",
        position: "relative",
        height: "100%",
        overflow: "auto",
      },
      "& li": {
        listStyle: "none",
        margin: 0,
        padding: 0,
      },
    },
    labelsListItem: {
      listStyle: "none",
      fontSize: "1.3rem",
      padding: 0,
      margin: 0,
      textTransform: "lowercase",
      cursor: "pointer",
      "&:hover": {
        textDecoration: "underline",
      },
    },
    pageTitle: {
      color: secondary.main,
      marginTop: 0,
      paddingLeft: "1rem",
    },
    linkComponent: {
      textDecoration: "none",
    },
    iconButtons: {
      fontSize: "1.5rem",
      margin: 0,
      padding: 0,
      boxSizing: "border-box",
      [breakpoints.down("sm")]: {
        marginLeft: "1rem",
      },
    },
  };
});

export default function Labels() {
  const [labelsList, setLabelsList] = useState([]);
  const [label, setLabel] = useState("");
  const [labelStatus, setLabelStatus] = useState("loading");
  const [records, setRecords] = useState([]);
  const [labelCategory, setLabelCategory] = useState("");
  const [alphabetizedLabels, setAlphabetizedLabels] = useState({});

  const classes = useStyles();

  useMemo(() => {
    const newLabels = {
      numbers: [],
      a: [],
      b: [],
      c: [],
      d: [],
      e: [],
      f: [],
      g: [],
      h: [],
      i: [],
      j: [],
      k: [],
      l: [],
      m: [],
      n: [],
      o: [],
      p: [],
      q: [],
      r: [],
      s: [],
      t: [],
      u: [],
      v: [],
      w: [],
      x: [],
      y: [],
      z: [],
    };

    labelsList.map((label) => {
      const firstChar = label.slice(0, 1).toLowerCase();
      if (!isNaN(firstChar)) {
        return newLabels.numbers.push(label);
      } else {
        return (newLabels[firstChar] = newLabels[firstChar].concat(label));
      }
    });
    setAlphabetizedLabels(newLabels);
  }, [labelsList]);

  useEffect(() => {
    const getLabels = async () => {
      try {
        const { data } = await API.get("/records/search");
        const labelsGrep = data
          .filter((obj) => {
            return obj.group === "Labels";
          })
          .map((obj) => obj.title);
        const labels = [...new Set(labelsGrep)];
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

  const theme = useTheme();

  return (
    <div className={classes.labelsContainer}>
      <Link to="/labels" className={classes.linkComponent}>
        <h1 className={classes.pageTitle}>labels</h1>
      </Link>
      <Paper className={classes.labelsListContainer}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            alignItems: "center",
            width: "100%",
            position: "relative",
          }}
        >
          <ul className={classes.labelsList}>
            {Object.keys(alphabetizedLabels).map((category, index) => {
              return (
                <>
                  <li>
                    {category === "numbers" ? (
                      <IconButton
                        className={classes.iconButtons}
                        onClick={() => {
                          setLabelCategory(category);
                        }}
                        style={{
                          textDecoration:
                            labelCategory === category && "underline",
                        }}
                      >
                        <span
                          style={{
                            height: "2rem",
                            width: "2rem",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          0-9
                        </span>
                      </IconButton>
                    ) : alphabetizedLabels[category].length > 0 ? (
                      <IconButton
                        className={classes.iconButtons}
                        onClick={() => {
                          setLabelCategory(category);
                        }}
                        style={{
                          textDecoration:
                            labelCategory === category && "underline",
                        }}
                      >
                        <span
                          style={{
                            height: "2rem",
                            width: "2rem",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          {category}
                        </span>
                      </IconButton>
                    ) : (
                      ""
                    )}
                  </li>
                </>
              );
            })}
          </ul>
        </div>
        {labelCategory && (
          <div style={{ border: "4px double #333", padding: "0.5rem" }}>
            {alphabetizedLabels[labelCategory].map((label) => {
              return (
                <p
                  className={classes.labelsListItem}
                  onClick={() => setLabel(label)}
                >
                  {alphabetizedLabels[labelCategory].length > 0
                    ? label
                    : "No Labels"}
                </p>
              );
            })}
          </div>
        )}
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
