import {
  Typography,
  Card,
  Box,
  IconButton,
  ButtonGroup,
  TextField,
} from "@mui/material";
import { orange, green, blue, blueGrey } from "@mui/material/colors";
import DeleteIcon from "@mui/icons-material/Delete";
import { useRef, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Cancel";

import InputAdornment from "@mui/material/InputAdornment";

import {
  useCompleteSubTaskMutation,
  useDeleteSubTaskByIdMutation,
  useEditSubTaskByIdMutation,
  useStartSubTaskMutation,
  usePauseSubTaskMutation,
} from "../../redux/features/subtask/subtaskApi";

import { useLocation } from "react-router-dom";
import AssignTaskModal from "./AssignTaskModal";

import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import TaskStatus from "./TaskStatus";
import MemberNameCard from "./MemberNameCard";
import { LoadingButton } from "@mui/lab";
import SpentTime from "./SpentTime";
export type subtaskType = {
  _id: string;
  title: string;
  parentTask: string;
  status: 'ideal' | 'paused' | 'running' | 'complete';
  time: {
    startTime: number;
    totalTime:number;
  };
  createdAt: string;
  updatedAt: string;
  assignedTo: {
    _id: string;
    name: string;
    email: string;
  };
};

const SubTaskCard = ({
  projectUser,
  subtask,
  subtaskindex,
  taskindex,
  type,
}: {
  subtask: subtaskType;
  subtaskindex: number;
  taskindex: number;
  projectUser: string;
  type: string;
}) => {
  const user = useSelector((state: RootState) => state.user);
  const { pathname } = useLocation();
  const projectId = pathname.split("/")[2];

  const [deleteSubTask] = useDeleteSubTaskByIdMutation();
  const [editSubTask] = useEditSubTaskByIdMutation();
  const [startTask, { isLoading: startSubtaskLoading }] =
    useStartSubTaskMutation();
  const [pauseTask, { isLoading: pauseSubtaskLoading }] =
    usePauseSubTaskMutation();
  const [completeTask, { isLoading: completeSubtaskLoading }] =
    useCompleteSubTaskMutation();
  const [taskTitle, setTaskTitle] = useState(subtask.title);
  const [edit, setEdit] = useState(false);
  const editField = useRef();

  const handleDelete = () => {
    deleteSubTask({
      projectId,
      subtaskId: subtask._id,
      taskId: subtask.parentTask,
    });
  };
  const handleEditFieldPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key == "Enter") {
      editSubTask({
        projectId,
        subtaskId: subtask._id,
        taskindex,
        subtaskindex,
        data: { title: taskTitle },
      });
      setEdit(false);
    }
  };
  const handleStartTask = () => {
    startTask({ projectId, subTaskId: subtask._id });
  };
  const handlePauseTask = () => {
    pauseTask({ projectId, subTaskId: subtask._id, data: subtask.time });
  };
  const handleResumeTask = () => {
    startTask({ projectId, subTaskId: subtask._id });
  };
  const handleCompleteTask = () => {
    completeTask({
      projectId,
      subTaskId: subtask._id,
      data: { ...subtask.time, status: subtask.status },
    });
  };

  let buttonToRender;

  switch (subtask.status) {
    case "ideal":
      buttonToRender = (
        <LoadingButton
          loading={startSubtaskLoading}
          onClick={handleStartTask}
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
          Start
        </LoadingButton>
      );
      break;
    case "running":
      buttonToRender = (
        <ButtonGroup>
          <LoadingButton
            loading={pauseSubtaskLoading}
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
            loading={completeSubtaskLoading}
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
            loading={startSubtaskLoading}
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
            loading={completeSubtaskLoading}
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

  const chooseSubTaskBackground = ()=> {
    
      if(
      subtask.status === 'complete'){
        return green[100]
      }
      if(subtask.status === 'ideal'){
        return blueGrey[100]
      }
      if(subtask.status === 'paused'){
        return orange[100]
      }
      if(subtask.status === 'running'){
        return blue[100]
      }
    
  }

  return (
    <Card sx={{ marginBottom: 1, padding: "1px", background: chooseSubTaskBackground() }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Box sx={{ flexGrow: 1 }}>
          {edit ? (
              <TextField
                autoFocus
                size="small"
                fullWidth
                value={taskTitle}
                onKeyDown={(e) => handleEditFieldPress(e)}
                onChange={(e) => setTaskTitle(e.target.value)}
                inputRef={editField}
                variant="filled"
                label="editing"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start"></InputAdornment>
                  ),
                }}
              />
          ) : (
            <Typography sx={{ paddingLeft: "5px" }}>
              {subtask.title}
            </Typography>
          )}
        </Box>
        {/* <Divider orientation="vertical" flexItem /> */}
        <Box>
          {/* decided which button to display */}
          {/* if paused then resume button, if  */}
          <ButtonGroup style={{ color: "black" }}>
            {/* {buttonToRender} */}
            {type == "team" && subtask.assignedTo?._id == user.id
              ? buttonToRender
              : type == "team" && <TaskStatus status={subtask.status} />}
            {type == "personal" && buttonToRender}
          </ButtonGroup>
          {projectUser == user.id && (
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
                subtask.status !== "complete" && (
                  <IconButton
                    onClick={() => {
                      setEdit(true);
                    }}
                  >
                    <EditIcon color="action" />
                  </IconButton>
                )
              )}

              <IconButton onClick={handleDelete} disabled={edit}>
                <DeleteIcon color="error" />
              </IconButton>
            </>
          )}
        </Box>
      </Box>

      {/* decide the assign button */}
      {type == "team" &&
        (subtask.assignedTo ? (
          <span
            style={{
              color: blueGrey[300],
              fontSize: 12,
              paddingLeft: 4,
              display: "block",
            }}
          >
            assigned to <MemberNameCard name={subtask.assignedTo.name} />
          </span>
        ) : (
          <AssignTaskModal
            projectId={projectId}
            taskid="taskid"
            taskIndex={taskindex}
            type="subtask"
            subtaskid={subtask._id}
            subtaskIndex={subtaskindex}
          />
        ))}
      <span style={{ paddingLeft: 5, display: "block" }}>
        {
          (subtask.time.totalTime > 0 || subtask.status == "running") && (
            <SpentTime time={subtask.time} status={subtask.status} />
          )

          // <span style={{fontSize:10, color:blueGrey[100],paddingLeft:4}}> Time Spent: {calcTime(subtask.time.totalTime)}</span>
        }
      </span>
    </Card>
  );
};

export default SubTaskCard;
