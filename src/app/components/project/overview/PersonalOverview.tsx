/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Button, Grid } from "@mui/material";
import {
  green,
  orange,
} from "@mui/material/colors";
import OverviewCard from "./OverviewCard";
import { calcTime } from "../../../lib/helpers/timeCal";
import { useChangeProjectStatusMutation } from "../../../redux/features/project/project.api";
import { LoadingButton } from "@mui/lab";
import { TodayOutlined } from "@mui/icons-material";
import AssignmentIcon from '@mui/icons-material/Assignment';
import PendingIcon from '@mui/icons-material/Pending';
import PauseCircleFilledIcon from '@mui/icons-material/PauseCircleFilled';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import QueryBuilderIcon from '@mui/icons-material/QueryBuilder';
import { subtaskType } from "../SubTaskCard";

const OtherStateButton = ({ title }: { title: string }) => {
  return (
    <Button
      disabled={true}
      sx={{
        color: "white",
        background:
          title == "Pending"
            ? "grey"
            : title == "Running"
            ? orange[500]
            : "green",
        "&:disabled": { color: "white" },
      }}
    >
      {title}
    </Button>
  );
};

const PersonalOverview = ({ data }:{data:any}) => {
  const personalOverViewFormat = {
    totaltask: 0,
    pending: 0,
    completed: 0,
    running: 0,
    paused: 0,
    totalTimespent: 0, //plus only if some are running.
  };
 data?.tasks?.reduce((prev:any, curr:any) => {
    if (curr.subtasks.length > 0) {
      curr.subtasks.forEach((s:subtaskType) => {
        if (s.status === "complete") {
          prev.completed += 1;
          prev.totalTimespent += s.time.totalTime;
        } else if (s.status === "running") {
          prev.running += 1;
          prev.totalTimespent +=
            s.time.totalTime + (new Date().getTime() - s.time.startTime);
        } else if (s.status === "paused") {
          prev.paused += 1;
          prev.totalTimespent += s.time.totalTime;
        } else {
          prev.pending += 1;
        }
        prev.totaltask += 1;
      });
    } else {
      if (curr.status === "complete") {
        prev.completed += 1;

        prev.totalTimespent += curr.time.totalTime;
      } else if (curr.status === "running") {
        prev.running += 1;
        prev.totalTimespent +=
          curr.time.totalTime + (new Date().getTime() - curr.time.startTime);
      } else if (curr.status === "paused") {
        prev.paused += 1;
        prev.totalTimespent += curr.time.totalTime;
      } else {
        prev.pending += 1;
      }
      prev.totaltask += 1;
    }
    return prev;
  }, personalOverViewFormat);

  const [changeStatus, {isLoading:changeStatusLoading}] = useChangeProjectStatusMutation();
  const completeButton = (
    <LoadingButton
    loading={changeStatusLoading}
      disabled={
        personalOverViewFormat.totaltask !== personalOverViewFormat.completed
      }
      sx={{
        color: "white",
        background: green[800],
        "&:hover": { background: green[900] },
        "&:disabled": { color: "grey" },
      }}
      onClick={()=> changeStatus({id:data?._id, data: {status:'complete'}})}
    >
      Mark as Completed
    </LoadingButton>
  );


  return (
    <Box>
      {data?.status == "complete" ? (
        <OtherStateButton title="Complete" />
      ) : personalOverViewFormat.totaltask ===
        personalOverViewFormat.completed ? (
        completeButton
      ) : personalOverViewFormat.pending !== 0 ? (
        <OtherStateButton title="Pending" />
      ) : (
        (personalOverViewFormat.running > 0 ||
          personalOverViewFormat.paused > 0) && (
          <OtherStateButton title="Running" />
        )
      )}
      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={6}>
          <OverviewCard
            title="Created On"
            count={new Date(data?.createdAt).toDateString()}
          >
            <TodayOutlined fontSize="large"/>
          </OverviewCard>
        </Grid>
        <Grid item xs={6}>
          <OverviewCard
            title="Total Tasks"
            count={personalOverViewFormat.totaltask}
          >
            <AssignmentIcon fontSize="large" color="primary"/>
          </OverviewCard>
        </Grid>
      </Grid>

      <Grid container spacing={1} sx={{ mt: 1 }}>
        <Grid item xs={6}>
          <OverviewCard
            title="Pending"
            count={personalOverViewFormat.pending}
          >
            <PendingIcon  fontSize="large"/>
          </OverviewCard>
        </Grid>
        <Grid item xs={6}>
          <OverviewCard
            title="Completed"
            count={personalOverViewFormat.completed}
          >
            <CheckCircleIcon color="success" fontSize="large"/>
          </OverviewCard>
        </Grid>
        <Grid item xs={6}>
          <OverviewCard
            title="Running"
            count={personalOverViewFormat.running}
            
          >
            <HourglassTopIcon color="info" fontSize="large"/>
          </OverviewCard>
        </Grid>
        <Grid item xs={6}>
          <OverviewCard title="Paused" count={personalOverViewFormat.paused}>
            <PauseCircleFilledIcon color="warning" fontSize="large"/>
          </OverviewCard>
        </Grid>
        <Grid item xs={6}>
          <OverviewCard
            title="Total Time Spent"
            count={`${calcTime(personalOverViewFormat.totalTimespent)} ${
              personalOverViewFormat.running ? "+" : ""
            }`}
          >
            <QueryBuilderIcon fontSize="large"/>
          </OverviewCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PersonalOverview;
