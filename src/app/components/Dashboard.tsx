import { Outlet } from "react-router-dom";
import SideBar from "./SideBar";
import { Grid } from "@mui/material";
import useDocumentTitle from "../../UseDocumentTitle";
const Dashboard = () => {
  useDocumentTitle({ title: "Dashboard" });
  return (
    <>
      <Grid item xs={1} sm={2}>
        <SideBar />
      </Grid>
      <Grid container spacing={2}>
        <Grid sx={{ background: "red" }} item xs={1} sm={2}>
          ""
        </Grid>
        <Grid item xs={11} sm={10}>
          <Outlet />
        </Grid>
      </Grid>
    </>
  );
};

export default Dashboard;
