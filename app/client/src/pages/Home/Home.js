import React from "react";
import RecordCard from "../../components/RecordCard/RecordCard";
import { Divider, Grid, Paper, Typography } from "@material-ui/core";
import HeroImage from "../../components/HeroImage/HeroImage";
import { useQuery } from "react-query";
import { API } from "../../util/fetch";
import useStyles from "./HomeStyles";
import ResultsGrid from "../../components/ResultsGrid/ResultsGrid";

export default function Home(props) {
  const classes = useStyles();

  const { data: newReleases, status: newReleasesStatus } = useQuery(
    "newReleases",
    async () => {
      const { data } = await API.post("/records/query", {
        category: "year",
        title: "2020",
      });
      return data;
    }
  );

  const { data: preLoved, status: preLovedStatus } = useQuery(
    "preLoved",
    async () => {
      const { data } = await API.post("/records/query", {
        category: "preloved",
        title: true,
      });
      return data;
    }
  );

  const RecordGrid = function (props) {
    const { query, status } = props;

    return (
      <Grid
        className={classes.recordsGrid}
        justify="space-evenly"
        container
        spacing={1}
      >
        {status === "success" &&
          query.map((record) => {
            return (
              <Grid item key={record.discogs_id}>
                <RecordCard record={record} />
              </Grid>
            );
          })}
      </Grid>
    );
  };

  return (
    <div className={classes.homeContainer}>
      <HeroImage>
        <div className={classes.heroContainer}>
          <Typography className={classes.heroText}>
            <span>catalog music</span>
          </Typography>
          <Divider />
        </div>
      </HeroImage>

      <Paper className={classes.categoryTitle}>
        <h1 className={classes.titleText}>new releases</h1>
      </Paper>
      {newReleasesStatus === "success" && (
        <ResultsGrid query={newReleases} status={newReleasesStatus} />
      )}
      <Paper className={classes.categoryTitle}>
        <h1 className={classes.titleText}>fresh pre-loved</h1>
      </Paper>
      {preLovedStatus === "success" && (
        <RecordGrid query={preLoved} status={preLovedStatus} />
      )}
    </div>
  );
}
