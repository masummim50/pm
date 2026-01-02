/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Card, Divider, Grid, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import OverviewCard from "./OverviewCard";
import TodayIcon from "@mui/icons-material/Today";
import { calcTime } from "../../../lib/helpers/timeCal";
import { blue, blueGrey, green, orange } from "@mui/material/colors";
import { useAppSelector } from "../../../redux/hooks";
import { RootState } from "../../../redux/store";
import { LoadingButton } from "@mui/lab";
import { useChangeProjectStatusMutation } from "../../../redux/features/project/project.api";
import { subtaskType } from "../SubTaskCard";

const MemberOverViewCard = ({
  title,
  value,
  color
}: {
  title: string;
  value: string | number;
  color: string;
}) => {
  return (
    <Grid item xs={6} sm={4}>
      <Card sx={{ backgroundColor: color,  padding: 1, borderRadius: 1 }}>
        <Typography sx={{ fontSize: { xs: 15, sm: 18 } }}>{title}</Typography>
        <Typography sx={{ fontSize: { xs: 12, sm: 15 } }}>{value}</Typography>
      </Card>
    </Grid>
  );
};

const GroupOverview = ({ data }: { data: any }) => {
  const user = useAppSelector((state: RootState) => state.user);
  const reformat = {
    totaltask: 0,
    pending: 0,
    completed: 0,
    running: 0,
    paused: 0,
    assigned: 0,
    unassigned: 0,
    totalTimespent: 0,
    members: {},
  };

  // {email:'em', name:'dl', totalTask:3, pending: 3, completed: 3, running:3,paused:4, totalTimeSpent:3}
  const reduced = data.tasks.reduce((prev: any, curr: any) => {
    if (curr.subtasks.length > 0) {
      prev.totaltask += curr.subtasks.length;
      curr.subtasks.forEach((s:subtaskType) => {
        // assigned vs unassigned
        if (s.assignedTo?.email) {
          prev.assigned += 1;
          //   manage member here:
          // check if this email exists in members:
          if (prev.members[s.assignedTo.email]) {
            prev.members[s.assignedTo.email].totalTask += 1;
            // add status based:
            if (s.status === "complete") {
              prev.members[s.assignedTo.email].completed += 1;
              prev.members[s.assignedTo.email].totalTimespent +=
                s.time.totalTime;
            } else if (s.status === "running") {
              prev.members[s.assignedTo.email].running += 1;
              prev.members[s.assignedTo.email].totalTimespent +=
                s.time.totalTime + (new Date().getTime() - s.time.startTime);
            } else if (s.status === "paused") {
              prev.members[s.assignedTo.email].paused += 1;
              prev.members[s.assignedTo.email].totalTimespent +=
                s.time.totalTime;
            } else {
              prev.members[s.assignedTo.email].pending += 1;
            }
            // end status based
          } else {
            // create new member object:
            prev.members[s.assignedTo.email] = {
              email: s.assignedTo.email,
              name: s.assignedTo.name,
              totalTask: 1,
              totalTimespent: s.time.totalTime,
            };
            if (s.status === "complete") {
              prev.members[s.assignedTo.email].completed = 1;
            } else {
              prev.members[s.assignedTo.email].completed = 0;
            }
            if (s.status === "running") {
              prev.members[s.assignedTo.email].running = 1;
            } else {
              prev.members[s.assignedTo.email].running = 0;
            }
            if (s.status === "paused") {
              prev.members[s.assignedTo.email].paused = 1;
            } else {
              prev.members[s.assignedTo.email].paused = 0;
            }
            if (s.status === "ideal") {
              prev.members[s.assignedTo.email].pending = 1;
            } else {
              prev.members[s.assignedTo.email].pending = 0;
            }
          }

          // member managing done
        } else {
          prev.unassigned += 1;
        }

        // check status
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

        // manage member oject
      });
    } else {
      // tasks that don't have subtasks
      prev.totaltask += 1;
      if (curr.assignedTo?.email) {
        prev.assigned += 1;
        // take care of assigned tasks:
        if (prev.members[curr.assignedTo.email]) {
          prev.members[curr.assignedTo.email].totalTask += 1;
          // add status based:
          if (curr.status === "complete") {
            prev.members[curr.assignedTo.email].completed += 1;
            prev.members[curr.assignedTo.email].totalTimespent +=
              curr.time.totalTime;
          } else if (curr.status === "running") {
            prev.members[curr.assignedTo.email].running += 1;
            prev.members[curr.assignedTo.email].totalTimespent +=
              curr.time.totalTime +
              (new Date().getTime() - curr.time.startTime);
          } else if (curr.status === "paused") {
            prev.members[curr.assignedTo.email].paused += 1;
            prev.members[curr.assignedTo.email].totalTimespent +=
              curr.time.totalTime;
          } else {
            prev.members[curr.assignedTo.email].pending += 1;
          }
        } else {
          // first time member object:
          prev.members[curr.assignedTo.email] = {
            email: curr.assignedTo.email,
            name: curr.assignedTo.name,
            totalTask: 1,
            totalTimespent: curr.time.totalTime,
          };
          if (curr.status === "complete") {
            prev.members[curr.assignedTo.email].completed = 1;
          } else {
            prev.members[curr.assignedTo.email].completed = 0;
          }
          if (curr.status === "running") {
            prev.members[curr.assignedTo.email].running = 1;
          } else {
            prev.members[curr.assignedTo.email].running = 0;
          }
          if (curr.status === "paused") {
            prev.members[curr.assignedTo.email].paused = 1;
          } else {
            prev.members[curr.assignedTo.email].paused = 0;
          }
          if (curr.status === "ideal") {
            prev.members[curr.assignedTo.email].pending = 1;
          } else {
            prev.members[curr.assignedTo.email].pending = 0;
          }
        }

        // end
      } else {
        prev.unassigned += 1;
      }

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
    }
    return prev;
  }, reformat);

  const values = [
    {
      icon: <TodayIcon fontSize="large" />,
      title: "Created On",
      count: new Date(data.createdAt).toDateString(),
    },
    {
      icon: <TodayIcon fontSize="large" />,
      title: "Total Task",
      count: reduced.totaltask,
    },
    {
      icon: <TodayIcon fontSize="large" />,
      title: "Completed",
      count: reduced.completed,
    },
    {
      icon: <TodayIcon fontSize="large" />,
      title: "Pending",
      count: reduced.pending,
    },
    {
      icon: <TodayIcon fontSize="large" />,
      title: "Running",
      count: reduced.running,
    },
    {
      icon: <TodayIcon fontSize="large" />,
      title: "Paused",
      count: reduced.paused,
    },
    {
      icon: <TodayIcon fontSize="large" />,
      title: "Assigned",
      count: reduced.assigned,
    },
    {
      icon: <TodayIcon fontSize="large" />,
      title: "UnAssigned",
      count: reduced.unassigned,
    },
    {
      icon: <TodayIcon fontSize="large" />,
      title: "Total Time",
      count: calcTime(reduced.totalTimespent),
    },
  ];

  const StatusButton = ({ title }: { title: string }) => {
    return (
      <Button
        variant="text"
        size="small"
        disabled
        sx={{
          background:
            title === "pending"
              ? blue[500]
              : title === "running"
              ? orange[500]
              : title === "complete"
              ? green[500]
              : "",
          color: "white",
          "&:disabled": { color: "white" },
        }}
      >
        {title}
      </Button>
    );
  };
  const [changeStatus, { isLoading: changeStatusLoading }] =
    useChangeProjectStatusMutation();
  const handleChangeStatus = () => {
    changeStatus({ id: data._id, data: { status: "complete" } });
  };

  return (
    <Box>
      {/* decide what button to render */}
      {/* total === pending them pending status */}
      {reduced.totaltask === reduced.pending && (
        <StatusButton title="pending" />
      )}
      {/* total > pending then 'running status */}
      {reduced.totaltask > reduced.pending && data.status !== "complete" && (
        <StatusButton title="running" />
      )}

      {data.status === "complete" && <StatusButton title="complete" />}

      {/* prject user same then complete button but disabled if total not == completed */}
      {user.id === data.user &&
        reduced.totaltask === reduced.completed &&
        data.status !== "complete" && (
          <LoadingButton
            loading={changeStatusLoading}
            variant="text"
            size="small"
            sx={{
              background: green[500],
              color: "white",
              "&:hover": { background: green[600] },
            }}
            onClick={handleChangeStatus}
          >
            Mark as completed
          </LoadingButton>
        )}

      <Box>{/* render status or a button to complete */}</Box>
      {/* general overview */}
      <Grid container spacing={1}>
        {values.map((v, i) => (
          <Grid key={i} item xs={6} sm={4}>
            <OverviewCard title={v.title} count={v.count}>
              {v.icon}
            </OverviewCard>
          </Grid>
        ))}
      </Grid>
      <Typography sx={{ margin: "30px 0 0 0", fontSize: 25 }}>
        Member's Overview
      </Typography>
      <Box>
        {Object.values(reduced.members).map((v: any) => (
          <Card
            sx={{
              marginTop: 1,
              // background: blueGrey[800],
              borderRadius: 1,
              p: 1,
            }}
          >
            <Typography sx={{ fontSize: { xs: 20, sm: 25 } }}>
              {v.name}
            </Typography>
            <Typography
              sx={{ fontSize: { xs: 15, sm: 12 }, color: blueGrey[200] }}
            >
              {v.email}
            </Typography>
            <Divider />
            <Grid container spacing={1}>
              <MemberOverViewCard title="Total Tasks" value={v.totalTask} color=""/>
              <MemberOverViewCard title="Completed" value={v.completed} color={green[50]} />
              <MemberOverViewCard title="Pending" value={v.pending}  color={blueGrey[50]}/>
              <MemberOverViewCard title="Running" value={v.running}  color={blue[50]}/>
              <MemberOverViewCard title="Paused" value={v.paused}  color={orange[50]}/>
              <MemberOverViewCard
                title="Time Spent"
                value={calcTime(v.totalTimespent)}
                color={green[50]}
              />
            </Grid>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default GroupOverview;
