import {
  Typography,
  Card,
  Button,
  Box,
  IconButton,
  Collapse,
  Divider,
  TextField,
  ButtonGroup,
  LinearProgress,
  
} from "@mui/material";
import { taskType } from "./project.interface";
import { orange, blue, blueGrey, green } from "@mui/material/colors";
import DeleteIcon from "@mui/icons-material/Delete";

import ExpandMore from "@mui/icons-material/ExpandMore";
import { useRef, useState } from "react";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import SubTaskContainer from "./SubTaskContainer";
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Cancel";

type taskCardPropsType = {
  task: taskType;
  projectId: string;
  type: string;
  projectUser: string;
  taskIndex: number;
};

import {
  useCompleteTaskMutation,
  useDeleteTaskByIdMutation,
  usePauseTaskMutation,
  useStartTaskMutation,
  useUpdateTaskByIdMutation,
} from "../../redux/features/task/taskApi";
import { calcTime } from "../../lib/helpers/timeCal";
import { subtaskType } from "./SubTaskCard";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import AssignTaskModal from "./AssignTaskModal";
import TaskStatus from "./TaskStatus";
import MemberNameCard from "./MemberNameCard";
import { LoadingButton } from "@mui/lab";
import { AddCircleOutline } from "@mui/icons-material";
import SpentTime from "./SpentTime";

const TaskCard = ({
  task,
  projectId,
  type,
  projectUser,
  taskIndex,
}: taskCardPropsType) => {
  const user = useSelector((state: RootState) => state.user);

  const [updateTask] = useUpdateTaskByIdMutation();
  const editField = useRef();
  const [deleteTask] = useDeleteTaskByIdMutation();
  const handleDeleteTask = () => {
    deleteTask({ projectid: projectId, taskid: task._id });
  };
  const [taskTitle, setTaskTitle] = useState(task.title);
  const handleUpdateTask = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key == "Enter") {
      updateTask({
        projectId,
        taskId: task._id,
        taskIndex,
        data: { title: taskTitle },
      });
      setEdit(false);
    }
  };
  const [expanded, setExpanded] = useState(false);
  const [edit, setEdit] = useState(false);
  const [startTask, { isLoading: startTaskLoading }] = useStartTaskMutation();
  const [pauseTask, { isLoading: pauseTaskLoading }] = usePauseTaskMutation();
  const [completeTask, { isLoading: completeTaskLoading }] =
    useCompleteTaskMutation();
  const handleStartTask = () => {
    startTask({ projectId, taskid: task._id });
  };
  const handlePauseTask = () => {
    pauseTask({ projectId, taskid: task._id, data: task.time });
  };
  const handleResumeTask = () => {
    startTask({ projectId, taskid: task._id });
  };
  const handleCompleteTask = () => {
    completeTask({ projectId, taskid: task._id, data: task });
  };

  let buttonToRender;
  if (!task?.subtasks?.length) {
    switch (task.status) {
      case "ideal":
        buttonToRender = (
          <LoadingButton
            onClick={handleStartTask}
            variant="text"
            loading={startTaskLoading}
            sx={{
              fontSize: 10,
              background: green[600],
              color: green[100],
              "&:hover": { background: green[900] },
              padding: "2px",
            }}
          >
            Start
          </LoadingButton>
        );
        break;
      case "running":
        buttonToRender = (
          <ButtonGroup>
            <LoadingButton
              loading={pauseTaskLoading}
              onClick={handlePauseTask}
              variant="text"
              color="info"
              size="small"
              sx={{
                fontSize: 10,
                background: blue[600],
                color: blue[100],
                "&:hover": { background: blue[900] },
                padding: "2px",
              }}
            >
              Pause
            </LoadingButton>
            <LoadingButton
              loading={completeTaskLoading}
              onClick={handleCompleteTask}
              variant="text"
              size="small"
              sx={{
                fontSize: 10,
                background: green[600],
                color: green[100],
                "&:hover": { background: green[900] },
                padding: "2px",
              }}
            >
              complete
            </LoadingButton>
          </ButtonGroup>
        );
        break;
      case "paused":
        buttonToRender = (
          <ButtonGroup>
            <LoadingButton
              loading={startTaskLoading}
              onClick={handleResumeTask}
              variant="text"
              size="small"
              sx={{
                fontSize: 10,
                background: orange[500],
                color: orange[100],
                "&:hover": { background: orange[700] },
                padding: "2px",
              }}
            >
              Resume
            </LoadingButton>
            <LoadingButton
              loading={completeTaskLoading}
              onClick={handleCompleteTask}
              variant="text"
              size="small"
              sx={{
                fontSize: 10,
                background: green[600],
                color: green[100],
                "&:hover": { background: green[900] },
                padding: "2px",
              }}
            >
              Complete
            </LoadingButton>
          </ButtonGroup>
        );
        break;
      case "complete":
        buttonToRender = (
          <Typography
            sx={{
              background: green[600],
              padding: "1px 10px",
              fontSize: 12,
              color: "white",
              borderRadius: "5px",
            }}
          >
            Completed
          </Typography>
        );

        break;
      default:
        break;
    }
  }
  const progressValue = () => {
    const completedNumber = task.subtasks.filter(
      (sub: subtaskType) => sub.status == "complete"
    );
    const value = (100 / task.subtasks.length) * completedNumber.length;
    return value;
  };
  const chooseTaskBackground = () => {
    if (task.subtasks.length > 0) {
      if(task.subtasks.every((s: subtaskType) => s.status === "complete")) {
        return green[50];
      }else{
        return blueGrey[50]
      }
    } else {
      if (task.status === "complete") {
        return green[50];
      }
      if (task.status === "ideal") {
        return blueGrey[50];
      }
      if (task.status === "paused") {
        return orange[50];
      }
      if (task.status === "running") {
        return blue[50];
      }
    }
  };
  return (
    <Card
      sx={{ marginBottom: 1, padding: 1, background: chooseTaskBackground() }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: {
            xs: "start",
            sm: "center",
          },
          gap: 1,
          flexDirection: {
            xs: "column",
            sm: "row",
          },
        }}
      >
        <Box sx={{ flexGrow: 1 }}>
          {edit ? (
            <TextField
              autoFocus
              onKeyDown={(e) => handleUpdateTask(e)}
              size="small"
              fullWidth
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              inputRef={editField}
              variant="filled"
              label="editing"
              InputProps={{
                endAdornment: <AddCircleOutline />,
              }}
            />
          ) : (
            <>
              <Typography sx={{ fontSize: 22 }}>{task.title}</Typography>
            </>
          )}
        </Box>
        <Box
          sx={{
            width: {
              xs: "100%",
              sm: "200px",
            },
          }}
        ></Box>

        <Box sx={{ gap: "2px", display: "flex", alignItems: "center" }}>
          {/* if project type is team then conditional rendering */}
          {type == "team" && task.assignedTo?._id == user.id
            ? buttonToRender
            : type == "team" &&
              task.subtasks.length == 0 && <TaskStatus status={task.status} />}
          {type == "personal" && buttonToRender}
          {/* {buttonToRender} */}

          {projectUser == user.id
          //  && task.status != "complete"
            && (
            <>
              {edit ? (
                <IconButton
                  onClick={() => {
                    setEdit(false);
                  }}
                >
                  <CancelIcon color="error" />
                </IconButton>
              ) : (
                <IconButton
                  size="small"
                  sx={
                    {
                      // background: blueGrey[800],
                      // "&:hover": { background: blueGrey[900] },
                    }
                  }
                  onClick={() => {
                    setEdit(true);
                  }}
                >
                  <EditIcon color="info" />
                </IconButton>
              )}

              <IconButton
                size="small"
                disabled={edit}
                onClick={() => handleDeleteTask()}
              >
                <DeleteIcon color="error" />
              </IconButton>
            </>
          )}
        </Box>
      </Box>
      {type == "team" &&
        !task.subtasks.length &&
        !task.assignedTo &&
        (projectUser == user.id ? (
          <AssignTaskModal
            projectId={projectId}
            taskid={task._id}
            taskIndex={taskIndex}
            type="task"
          />
        ) : (
          "unassigned"
        ))}
      {type == "team" && !task.subtasks.length && task.assignedTo && (
        <span style={{ color: blueGrey[300], fontSize: 12, display: "block" }}>
          task assigned to <MemberNameCard name={task.assignedTo.name} />
        </span>
      )}
      {task.subtasks.length > 0 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            py: 1,
          }}
        >
          <span>Progress </span>
          <Divider orientation="vertical" flexItem />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              width: "100%",
              alignItems: "center",
              position: "relative",
            }}
          >
            <LinearProgress
              // color="primary"
              sx={{
                // color: green,
                background: blueGrey[200],
                height: "15px",
                // ".MuiLinearProgress-bar	": { background: "green" },
                width: "70%",
                borderRadius: "5px",
              }}
              value={progressValue()}
              variant="determinate"
            />
            <span
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                color: "black",
                fontSize: 12,
                transform: "translate(-50%, -50%)",
              }}
            >
              {progressValue().toFixed(2)}%
            </span>
          </Box>
        </Box>
      )}

      {(task.time.totalTime > 0 || task.status === "running") && (
        // <span style={{ fontSize: 10, color: blueGrey[100] }}>
        //   {" "}
        //   Time Spent: {calcTime(task.time.totalTime)} start time: {calcTime(task.time.startTime)}
        // </span>
        <SpentTime time={task.time} status={task.status} />
      )}
      {task.subtasks.length > 0 && (
        <Typography
          sx={{
            fontSize: { xs: 10, sm: 12 },
            color: progressValue() === 100 ? green[600] : "black",
          }}
        >
          Time Spent:{" "}
          {calcTime(
            task.subtasks.reduce(
              (prev: number, curr: subtaskType) => prev + curr.time.totalTime,
              0
            )
          )}
        </Typography>
      )}
      {/* render subtask only if task hasn't been assigned to anyone */}
      {!task.assignedTo && (
        <Box sx={{ display: task.status !== "ideal" ? "none" : "block" }}>
          <Divider />
          <Button
            sx={{ fontSize: 10, marginTop: 1, color: "white" }}
            size="small"
            endIcon={expanded ? <ExpandLessIcon /> : <ExpandMore />}
            onClick={() => setExpanded(!expanded)}
            variant="text"
            // color='info'
            style={{ background: blueGrey[800] }}
          >
            subtask{" "}
            <span style={{ color: "white", paddingLeft: "5px" }}>
              {task.subtasks.length}
            </span>
          </Button>
          <Collapse in={expanded} sx={{ marginTop: 1 }}>
            <SubTaskContainer
              subtasks={task.subtasks}
              taskId={task._id}
              taskindex={taskIndex}
              projectUser={projectUser}
              projecttype={type}
            />
          </Collapse>
        </Box>
      )}
    </Card>
  );
};

export default TaskCard;
