import React, { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { API } from "../../util/fetch";
import useStyles from "./DashboardStyles";
import { DataGrid } from "@material-ui/data-grid";
import { useQuery } from "react-query";
import { getDate } from "../../util/helpers/newsHelpers";
import Papa from "papaparse";
import { Button } from "@material-ui/core";
import AddRecordModal from "./AddRecordModal";

export default function AddRecords() {
  const [records, setRecords] = useState([]);
  const [rows, setRows] = useState([]);
  const classes = useStyles();

  const columns = [
    { field: "discogsId", headerName: "Discogs Id", width: 150 },
    { field: "artists", headerName: "Artist(s)", width: 150 },
    { field: "releaseTitle", headerName: "Release Title", width: 150 },
    { field: "review", headerName: "Review", width: 150 },
    { field: "description", headerName: "Description", width: 150 },
    { field: "dateAdded", headerName: "Date Added", width: 150 },
    { field: "preloved", headerName: "Preloved?", width: 150 },
  ];

  const { data: recordData, status: recordsStatus } = useQuery(
    "records",
    async () => {
      const { data } = await API.post("/records/query");
      setRecords(data);
      return data;
    }
  );

  useEffect(() => {
    const rows = records.map((record, index) => {
      return {
        id: index + 1,
        discogsId: record.discogs_id,
        artists: record.artists_sort,
        releaseTitle: record.release_title,
        review: record.review,
        description: record.description,
        preloved: record.preloved,
        dateAdded: getDate(record.created_at),
      };
    });
    setRows(rows);
  }, [records]);

  const [discogsRecords, setDiscogsRecords] = useState([]);
  const [discogsRows, setDiscogsRows] = useState([]);
  const csvField = useRef(null);

  const AddRecordsButton = (props) => {
    const [addRecordModal, setAddRecordModal] = useState(false);

    const { params } = props;

    return (
      <React.Fragment>
        <Button
          variant="contained"
          color="secondary"
          size="small"
          style={{
            backgroundColor: "blue",
          }}
          onClick={() => {
            console.log(addRecordModal);
            setAddRecordModal(true);
            console.log(addRecordModal);
          }}
        >
          Add
        </Button>
        {addRecordModal && (
          <AddRecordModal
            addRecordModal={addRecordModal}
            setAddRecordModal={setAddRecordModal}
          />
        )}
      </React.Fragment>
    );
  };

  function handleClickCSV() {
    Papa.parse(csvField.current.files[0], {
      complete: function (results) {
        results.data.shift();
        const parsedRecords = results.data.map((data, index) => {
          return {
            id: index + 1,
            listing_id: data[0],
            artist: data[1],
            title: data[2],
            label: data[3],
            catno: data[4],
            format: data[5],
            release_id: data[6],
            qty: data[16],
            price: data[8],
          };
        });

        const filteredRecords = [];
        const recordIds = records.map((record) => {
          return record.discogs_id;
        });
        console.log(recordIds);
        parsedRecords.map((record) => {
          return recordIds.includes(record.release_id)
            ? console.log("not added")
            : filteredRecords.push(record);
        });

        setDiscogsRecords(filteredRecords);

        const discogsRows = discogsRecords.map((record, index) => {
          return {
            id: index + 1,
            discogsId: record.release_id,
            artists: record.artist,
            releaseTitle: record.title,
          };
        });
        setDiscogsRows(discogsRows);
      },
    });
  }

  const discogsColumns = [
    { field: "discogsId", headerName: "Discogs ID", width: 150 },
    { field: "artists", headerName: "Artists", width: 200 },
    { field: "releaseTitle", headerName: "Release Title", width: 180 },
    {
      field: "addButton",
      headerName: "Add To Shop",
      width: 120,
      renderCell: (params) => {
        return <AddRecordsButton />;
      },
    },
  ];

  return (
    <div className={classes.componentContainer}>
      <div style={{ height: 500, width: "100%", padding: "1rem" }}>
        <DataGrid rows={rows} columns={columns} pageSize={50} />
      </div>
      <div style={{ height: 1000, width: "100%", padding: "1rem" }}>
        <h3>Discogs Data</h3>
        <div>
          <input
            ref={csvField}
            type="file"
            name="csv-field"
            id="csvField"
            accept=".csv"
          />
          <button id="csv-btn" onClick={(e) => handleClickCSV()}>
            Search CSV
          </button>
        </div>
        <DataGrid rows={discogsRows} columns={discogsColumns} pageSize={50} />
      </div>
    </div>
  );
}
