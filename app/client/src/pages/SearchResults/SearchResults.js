import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core";
import { API } from "../../util/fetch";
import { useQuery } from "react-query";
import { useGlobal } from "../../context/GlobalState";
import ResultsGrid from "../../components/ResultsGrid/ResultsGrid";
import TitleBar from "../../components/TitleBar/TitleBar";

const useStyles = makeStyles((theme) => {
  const {
    palette: { primary, secondary },
  } = theme;
  return {
    searchContainer: {
      backgroundColor: primary.main,
      width: "100%",
      height: "100%",
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

export default function SearchResults() {
  const classes = useStyles();
  const globe = useGlobal();
  const [title, setTitle] = useState();
  const [category, setCategory] = useState();

  const { searchQuery } = globe;

  useEffect(() => {
    if (searchQuery) {
      if (searchQuery.group === "Titles") {
        setCategory("release_title");
      }
      if (searchQuery.group === "Artists") {
        setCategory("artists_sort");
      } else {
        setCategory(searchQuery.group.toLowerCase());
      }
      setTitle(searchQuery.title);
    }
  }, [searchQuery, setTitle, setCategory]);

  const { data: results, status } = useQuery(`${title}`, async () => {
    const { data } = await API.post(`/records/query`, { category, title });
    return data;
  });

  return (
    <div className={classes.searchContainer}>
      <TitleBar
        title={`${
          category === "artists_sort" ? "artists" : category
        } : ${title}`}
      />
      {status === "loading" && <p>loading...</p>}
      {status === "success" && <ResultsGrid query={results} status={status} />}
    </div>
  );
}
