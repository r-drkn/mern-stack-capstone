import React, { useEffect, useState } from "react";
import { API } from "../../util/fetch";
import { Link } from "react-router-dom";
import { IconButton, makeStyles, Paper } from "@material-ui/core";
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
      display: "flex",
      padding: 0,
      [breakpoints.down("md")]: {
        display: "flex",
        justifyContent: "space-evenly",
      },
      "& li": {
        listStyle: "none",
        margin: 0,
        padding: 0,
        "&:hover": {},
        "& h3": {
          cursor: "pointer",
          "&: hover": {
            fontSize: "1rem",
            cursor: "pointer",
          },
        },
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
        // fontWeight: "800",
        textDecoration: "underline",
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
  const [labelCategory, setLabelCategory] = useState("");

  const classes = useStyles();
  let alphabetizedLabels = {
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

  const addToAlpha = () => {
    labelsList.map((label) => {
      const firstChar = label.slice(0, 1).toLowerCase();
      if (!isNaN(firstChar)) {
        return alphabetizedLabels.numbers.push(label);
      } else {
        return (alphabetizedLabels[firstChar] = alphabetizedLabels[
          firstChar
        ].concat(label));
      }
    });
  };
  addToAlpha();

  return (
    <div className={classes.genresContainer}>
      <Link to="/labels" className={classes.linkComponent}>
        <h1 className={classes.pageTitle}>labels</h1>
      </Link>
      <Paper className={classes.genresListContainer}>
        <ul className={classes.genresList}>
          {Object.keys(alphabetizedLabels).map((category, index) => {
            return (
              <>
                <li>
                  {category === "numbers" ? (
                    <IconButton
                      style={{ fontSize: "1rem" }}
                      onClick={() => {
                        setLabelCategory(category);
                      }}
                    >
                      <span style={{}}>0-9</span>
                    </IconButton>
                  ) : (
                    <IconButton
                      style={{ fontSize: "1rem" }}
                      onClick={() => {
                        setLabelCategory(category);
                      }}
                    >
                      <span style={{}}>{category}</span>
                    </IconButton>
                  )}
                </li>
              </>
            );
          })}
        </ul>
        {labelCategory && (
          <div style={{ border: "4px double #333", padding: "0.5rem" }}>
            {alphabetizedLabels[labelCategory].map((label) => {
              return (
                <p
                  className={classes.genreListItem}
                  onClick={() => setLabel(label)}
                >
                  {alphabetizedLabels[labelCategory].length
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
