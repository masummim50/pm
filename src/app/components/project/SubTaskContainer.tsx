import React, { useState } from "react";
import {
  Box,
  TextField,
  InputAdornment,
  
  LinearProgress,
  Button,
} from "@mui/material";

import SubTaskCard, { subtaskType } from "./SubTaskCard";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useLocation, useParams } from "react-router-dom";
import { useCreateSubTaskMutation } from "../../redux/features/subtask/subtaskApi";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useGetPersonalProjectByIdQuery } from "../../redux/features/project/project.api";
import SubtaskSortButtons from "./SubtaskSortButtons";
import { getCurrentTimeString } from "../../lib/dateFunctions";
import { LoadingButton } from "@mui/lab";

const SubTaskContainer = ({
  taskId,
  subtasks,
  projectUser,
  taskindex,
  projecttype,
}: {
  taskId: string;
  subtasks: subtaskType[];
  projectUser: string;
  taskindex: number;
  projecttype: string;
}) => {
  const { id } = useParams();
  const { data } = useGetPersonalProjectByIdQuery(id);
  const [parent] = useAutoAnimate();
  const user = useSelector((state: RootState) => state.user);
  const filter = useSelector((state: RootState) => state.filter.filter);
  const taskType = useSelector((state: RootState) => state.filter.taskType);
  const { pathname } = useLocation();
  const projectId = pathname.split("/")[2];
  const [createSubTask, { isLoading: createSubtaskLoading }] =
    useCreateSubTaskMutation();
  const [subTask, setSubTask] = useState("");
  const handleKeyChange = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key == "Enter") {
      handleCreateSubTask();
    }
  };

  const handleCreateSubTask = () => {
    createSubTask({
      projectId,
      taskId,
      data: { title: subTask, parentTask: taskId },
    });

    setSubTask("");
  };

  const addRandomSubTask = () => {
    const subtask = `SubTask -- ${getCurrentTimeString()}`;
    setSubTask(subtask);
  };
  return (
    <Box>
      {user.id === projectUser && data?.data?.status !== "complete" && (
        <>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <TextField
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">
                    <AddCircleOutlineIcon />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              onKeyDown={(e) => handleKeyChange(e)}
              value={subTask}
              onChange={(e) => setSubTask(e.target.value)}
              size="small"
              label="Add SubTask"
              sx={{
                width: "100%",
                maxWidth: "390px",
              }}
            />

            <LoadingButton
              loading={createSubtaskLoading}
              onClick={handleCreateSubTask}
              variant="contained"
              color="primary"
              sx={{color:'white'}}
            >
              Create
            </LoadingButton>
            <Button
              onClick={addRandomSubTask}
              variant="contained"
              color="secondary"
            >
              Random
            </Button>
          </Box>
          <Box
            sx={{ maxWidth: "390px", opacity: createSubtaskLoading ? 1 : 0 }}
          >
            <LinearProgress color="success" />
          </Box>
          
        </>
      )}
      <div ref={parent}>
        {subtasks?.length > 1 && <SubtaskSortButtons taskIndex={taskindex} />}
        {subtasks
          ?.filter((s) => {
            if (filter) {
              if (user.id === s.assignedTo?._id) {
                return s;
              } else {
                return null;
              }
            } else {
              return s;
            }
          })
          .filter((s) => {
            if (taskType) {
              if (s.status === taskType) {
                return s;
              } else {
                return null;
              }
            } else {
              return s;
            }
          })
          .map((subtask: subtaskType, index: number) => (
            <SubTaskCard
              projectUser={projectUser}
              taskindex={taskindex}
              subtaskindex={index}
              key={subtask._id}
              subtask={subtask}
              type={projecttype}
            />
          ))}
      </div>
    </Box>
  );
};

export default SubTaskContainer;
