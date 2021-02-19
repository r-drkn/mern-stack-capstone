import React, { useEffect, useState } from "react";
import { API } from "../../util/fetch";
import { DataGrid } from "@material-ui/data-grid";
import Button from "@material-ui/core/Button";
import { useAuth } from "../../context/AuthContext";

const AdminButton = (props) => {
  const { params } = props;
  const [isAdmin, setIsAdmin] = useState(params.value.isAdmin);

  const promoteAdmin = async (username, email) => {
    console.log("promoted");
    try {
      await API.post("/admin/promote", {
        username: username,
        email: email,
      });
      setIsAdmin(true);
    } catch (error) {
      console.log(error);
    }
  };

  const demoteAdmin = async (username, email) => {
    console.log("demoted");
    try {
      await API.post("/admin/demote", { username: username, email: email });
      setIsAdmin(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <React.Fragment>
      {!params.value.isSuper ? (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            padding: "1rem",
            alignItems: "center",
          }}
        >
          <p>{isAdmin ? "Admin" : "User"}</p>

          <Button
            variant="contained"
            color="secondary"
            size="small"
            style={{
              backgroundColor: isAdmin ? "red" : "blue",
            }}
            onClick={() => {
              isAdmin
                ? demoteAdmin(params.row.username, params.row.email)
                : promoteAdmin(params.row.username, params.row.email);
            }}
          >
            {isAdmin ? "Demote" : "Promote"}
          </Button>
        </div>
      ) : (
        "(SuperAccount)"
      )}
    </React.Fragment>
  );
};

export default function Users() {
  const [users, setUsers] = useState([]);
  const [rows, setRows] = useState([]);

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "username", headerName: "Username", width: 150 },
    { field: "email", headerName: "Email", width: 200 },
    {
      field: "role",
      headerName: "Role",
      width: 200,
      renderCell: (params) => {
        return <AdminButton params={params} />;
      },
    },
  ];

  useEffect(() => {
    try {
      const getUsers = async () => {
        const {
          data: { users },
        } = await API.get("/admin/users");
        setUsers(users);
      };
      getUsers();
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    const rows = users.map((user, index) => {
      return {
        id: index + 1,
        username: user.username,
        email: user.email,
        role: {
          isSuper: user.roles.includes("super"),
          isAdmin: user.roles.includes("admin"),
        },
      };
    });
    setRows(rows);
  }, [users]);

  return (
    <div
      style={{
        padding: "2rem 1rem",
        height: 500,
        width: "100%",
      }}
    >
      <DataGrid rows={rows} columns={columns} pageSize={50} />
    </div>
  );
}
