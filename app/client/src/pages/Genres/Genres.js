import React, { useEffect, useState } from "react";
import { makeStyles, Paper } from "@material-ui/core";
import { API } from "../../util/fetch";
import ResultsGrid from "../../components/ResultsGrid/ResultsGrid";
import TitleBar from "../../components/TitleBar/TitleBar";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => {
  const {
    palette: { primary, secondary },
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

export default function Genres() {
  const classes = useStyles();
  const [genresList, setGenresList] = useState([]);
  const [genre, setGenre] = useState("");
  const [genreStatus, setGenreStatus] = useState("loading");
  const [records, setRecords] = useState([]);

  const showGenres = function (allGenres) {
    const catalogGenres = [
      "Dub",
      "Reggae",
      "afro",
      "latin",
      "world",
      "Funk",
      "Soul",
      "Boogie",
      "modern soul",
      "hip hop",
      "RnB",
      "grime",
      "drum and bass",
      "jungle",
      "bass",
      "breakbeat",
      "dubstep",
      "techno",
      "beats",
      "house",
      "nujazz",
      "broken beats",
      "jazz",
      "fusion",
      "indie",
      "rock",
      "punk",
      "metal",
      "electronic",
      "ambient",
      "experiental",
      "blues",
      "folk",
      "prog",
      "kraut",
      "synth",
      "new wave",
      "psyche",
      "soundtracks",
      "library",
      "Special effects",
      "spoken word",
      "Classical",
    ];
    const genres = [];
    allGenres.map((genre) => {
      return catalogGenres.includes(genre.title.toLowerCase())
        ? genres.push(genre)
        : null;
    });
    // console.log(genres);
    setGenresList(genres);
  };

  useEffect(() => {
    const getGenres = async () => {
      try {
        const { data } = await API.get("/records/search");
        const genresGrep = data.filter((obj) => {
          return obj.group === "Styles";
        });
        showGenres(genresGrep);
      } catch (error) {
        console.log(error);
      }
    };
    getGenres();
  }, []);

  useEffect(() => {
    if (genre !== "") {
      const getRecords = async () => {
        try {
          const { data } = await API.post("/records/query", {
            category: "styles",
            title: genre,
          });
          if (data.length > 0) {
            setRecords(data);
          }
          setGenreStatus("success");
        } catch (error) {
          setGenreStatus("error");
        }
      };
      getRecords();
    }
  }, [genre]);

  const { data: techno, status: technoStatus } = useQuery(
    "techno",
    async () => {
      const { data } = await API.post("/records/query", {
        category: "styles",
        title: "techno",
      });
      return data;
    }
  );

  return (
    <div className={classes.genresContainer}>
      <Link to="/genres" className={classes.linkComponent}>
        <h1 className={classes.pageTitle}>genres</h1>
      </Link>
      <Paper className={classes.genresListContainer}>
        <ul className={classes.genresList}>
          {genresList.map((genre) => {
            return (
              <li
                className={classes.genreListItem}
                onClick={() => setGenre(genre.title)}
              >
                {genre.title}
              </li>
            );
          })}
        </ul>
      </Paper>
      {genre ? (
        <React.Fragment>
          <TitleBar title={genre} />
          <ResultsGrid query={records} status={genreStatus} />
        </React.Fragment>
      ) : (
        <React.Fragment>
          <TitleBar title="techno" />
          <ResultsGrid query={techno} status={technoStatus} />
        </React.Fragment>
      )}
    </div>
  );
}
