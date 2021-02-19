import { List, ListItem, ListItemText } from "@material-ui/core";
import React from "react";
import AddRecords from "./AddRecords";
import AddBlog from "./AddBlog";
import useStyles from "./DashboardStyles";
import { useGlobal } from "../../context/GlobalState";
import EditBlog from "./EditBlog";
import { useAuth } from "../../context/AuthContext";
import EditUsers from "./EditUsers";

export default function Dashboard() {
  const classes = useStyles();
  const globe = useGlobal();
  const auth = useAuth();
  const { isSuper } = auth;
  const { dashComponent, setDashComponent } = globe;

  return (
    <React.Fragment>
      {isSuper() ? (
        <div className={classes.dashboardContainer}>
          <List style={{ margin: "1rem", borderRight: "2px solid black" }}>
            <ListItem button onClick={() => setDashComponent("addRecords")}>
              <ListItemText primary="Add Records" />
            </ListItem>
            <ListItem button onClick={() => setDashComponent("newBlog")}>
              <ListItemText primary="New Blog" />
            </ListItem>
            <ListItem button onClick={() => setDashComponent("editBlog")}>
              <ListItemText primary="Edit Blog" />
            </ListItem>
            <ListItem button onClick={() => setDashComponent("users")}>
              <ListItemText primary="Users" />
            </ListItem>
          </List>
          <main className={classes.componentContainer}>
            {dashComponent === "addRecords" && <AddRecords />}
            {dashComponent === "newBlog" && <AddBlog />}
            {dashComponent === "editBlog" && <EditBlog />}
            {dashComponent === "users" && <EditUsers />}
          </main>
        </div>
      ) : (
        <span>You shouldn't be here.</span>
      )}
    </React.Fragment>
  );
}
