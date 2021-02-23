import React, { useEffect, useState, useRef } from "react";
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
  const [discogsRecords, setDiscogsRecords] = useState([]);
  const [discogsRows, setDiscogsRows] = useState([]);

  const classes = useStyles();
  const csvField = useRef(null);

  const columns = [
    { field: "discogsId", headerName: "Discogs Id", width: 150 },
    { field: "artists", headerName: "Artist(s)", width: 150 },
    { field: "releaseTitle", headerName: "Release Title", width: 150 },
    { field: "review", headerName: "Review", width: 150 },
    { field: "description", headerName: "Description", width: 150 },
    { field: "dateAdded", headerName: "Date Added", width: 150 },
    { field: "preloved", headerName: "Preloved?", width: 150 },
  ];

  const { data: recordData, status: recordsStatus, refetch } = useQuery(
    "records",
    async () => {
      const { data } = await API.post("/records/query");
      setRecords(data);
      return data;
    }
  );

  const updateTables = async (row) => {
    const rowIndex = discogsRows.findIndex(
      (item) => item.discogsId === row.discogsId
    );
    const newRows = [...discogsRows];
    newRows.splice(rowIndex, 1);
    setDiscogsRows(newRows);

    const recordIndex = discogsRecords.findIndex(
      (item) => item.release_id === row.discogsId
    );
    const newRecords = [...discogsRecords];
    newRecords.splice(recordIndex, 1);
    setDiscogsRows(newRows);

    // const filteredRecords = [];
    // const recordIds = records.map((record) => record.discogs_id);
    // discogsRecords.map((record) => {
    //   return recordIds.includes(parseInt(record.release_id))
    //     ? null
    //     : filteredRecords.push(record);
    // });
    // setDiscogsRecords(filteredRecords);
  };

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

  useEffect(() => {
    const discogsRows = discogsRecords.map((record, index) => {
      return {
        id: index + 1,
        discogsId: record.release_id,
        artists: record.artist,
        releaseTitle: record.title,
        price: record.price,
      };
    });
    setDiscogsRows(discogsRows);
  }, [discogsRecords]);

  const AddRecordsButton = (props) => {
    const [addRecordModal, setAddRecordModal] = useState(false);

    const { params } = props;
    const record = {
      release_id: params.row.discogsId,
      price: params.row.price * 100,
    };
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
            setAddRecordModal(true);
          }}
        >
          Add
        </Button>
        {addRecordModal && (
          <AddRecordModal
            row={params.row}
            addRecordModal={addRecordModal}
            setAddRecordModal={setAddRecordModal}
            record={record}
            updateTables={updateTables}
            refetchRecords={refetch}
          />
        )}
      </React.Fragment>
    );
  };

  // const getSquareCatalog = async () => {
  //   try {
  //     const { data } = await API.get("/shop/list-square");
  //     console.log(data);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  // getSquareCatalog();

  const getDiscogsCatalog = async () => {
    try {
      const { data } = await API.get("/shop/list-discogs");
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  getDiscogsCatalog();

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
        parsedRecords.map((record) => {
          return recordIds.includes(parseInt(record.release_id))
            ? null
            : filteredRecords.push(record);
        });

        setDiscogsRecords(filteredRecords);
      },
    });
  }

  const discogsColumns = [
    { field: "discogsId", headerName: "Discogs ID", width: 150 },
    { field: "artists", headerName: "Artists", width: 200 },
    { field: "releaseTitle", headerName: "Release Title", width: 180 },
    { field: "price", headerName: "Discogs Price", width: 150 },
    {
      field: "addButton",
      headerName: "Add To Shop",
      width: 200,
      renderCell: (params) => {
        return <AddRecordsButton params={params} />;
      },
    },
  ];

  return (
    <div className={classes.componentContainer}>
      <div style={{ height: 500, width: "100%", padding: "1rem" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={50}
          style={{ position: "relative", marginBottom: "1rem" }}
        />
      </div>
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
      <div style={{ height: 600, width: "100%", padding: "1rem" }}>
        <DataGrid rows={discogsRows} columns={discogsColumns} pageSize={50} />
      </div>
    </div>
  );
}
