/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useEffect, useRef, useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import TaskCard from "./TaskCard";
import { projectType, taskType } from "./project.interface";
import { useAddNewTaskMutation } from "../../redux/features/task/taskApi";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import NoItemFound from "./NoItemFound";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { blueGrey } from "@mui/material/colors";
import { useChangeProjectStatusMutation } from "../../redux/features/project/project.api";
import { useAppSelector } from "../../redux/hooks";
import TaskSortButtons from "./TaskSortButtons";
import FilteredItemNotFound from "./FilteredItemNotFound";
import { subtaskType } from "./SubTaskCard";
import { getCurrentTimeString } from "../../lib/dateFunctions";

const ProjectTasks = ({ project }: { project: projectType }) => {
  const [parent] = useAutoAnimate();
  const { _id: projectId, tasks, type } = project;
  const [addNewTask, { isSuccess: taskAddingSuccess, isLoading: addingTask }] =
    useAddNewTaskMutation();
  const [title, setTitle] = useState("");

  const handleAddNewTask = () => {
    addNewTask({ id: projectId, data: { title } });
  };
  const checkEnterPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key == "Enter") {
      handleAddNewTask();
    }
  };
  const taskRef = useRef();
  useEffect(() => {
    if (taskAddingSuccess) {
      setTitle("");
    }
  }, [taskAddingSuccess]);
  const user = useSelector((state: RootState) => state.user);
  const [changeProjectStatus, { isLoading: changeStatusLoading }] =
    useChangeProjectStatusMutation();
  const handleChangeStatus = () => {
    changeProjectStatus({ id: project._id, data: { status: "pending" } });
  };
  const isFilter = useAppSelector((state: RootState) => state.filter.filter);
  const taskType = useAppSelector((state: RootState) => state.filter.taskType);
  const typeFilterFunction = (task: taskType) => {
    if (taskType !== "") {
      if (task.subtasks.length > 0) {
        const found = task.subtasks.some(
          (s: subtaskType) => s.status === taskType
        );
        if (found) {
          return task;
        } else {
          return null;
        }
      } else {
        if (task.status === taskType) {
          return task;
        } else {
          return null;
        }
      }
    } else {
      return task;
    }
  };

  let count = 0;
  useEffect(() => {
    count = 0;
  }, [isFilter, taskType]);

  const addRandomTask = () => {
    const title = `Task -- ${getCurrentTimeString()}`;
    setTitle(title);
  };

  return (
    <Box>
      {/* <Typography color={"lightgray"}>Tasks</Typography> */}
      {project.user == user.id && project.status !== "complete" && (
        <Box sx={{ display: "flex", alignItems: "center", marginTop: 3 }}>
          <TextField
            autoFocus
            inputRef={taskRef}
            placeholder="add new task"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            size="small"
            style={{
              flexGrow: 1,
              maxWidth: "400px",
            }}
            label="Task"
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
              checkEnterPress(e)
            }
          ></TextField>
          <LoadingButton variant="contained" loading={addingTask} onClick={handleAddNewTask}>
            Add Task
          </LoadingButton>
          <Button onClick={addRandomTask} variant="contained" color="secondary">
            Random
          </Button>
        </Box>
      )}
      {project.status === "complete" && (
        <LoadingButton
          loading={changeStatusLoading}
          onClick={handleChangeStatus}
          sx={{
            background: blueGrey[300],
            color: "white",
            "&:hover": { background: blueGrey[500] },
          }}
        >
          Re-open Project
        </LoadingButton>
      )}
      <Box>{tasks.length === 0 && <NoItemFound title="Task" />}</Box>

      {tasks.length > 1 && <TaskSortButtons type={type} />}

      <Box sx={{ gap: 1, minHeight: "100vh", marginTop: 2 }}>
        <div ref={parent}>
          {tasks
            ?.filter((t: any) => {
              if (isFilter) {
                if (t.subtasks.length > 0) {
                  // if one subtask if found with his id then return true from here.
                  const found = t.subtasks.some((s: any) => {
                    return s.assignedTo?._id === user.id;
                  });
                  if (found) {
                    return t;
                  } else {
                    return null;
                  }
                } else {
                  if (user.id === t.assignedTo?._id) {
                    return t;
                  } else {
                    return null;
                  }
                }
              } else {
                return t;
              }
            })
            .filter(typeFilterFunction)
            .map((task: taskType, index: number) => {
              if (task) {
                count++;
              }
              return (
                <TaskCard
                  key={task?._id}
                  projectId={projectId}
                  type={type}
                  task={task}
                  projectUser={project.user}
                  taskIndex={index}
                />
              );
            })}
        </div>
        {(isFilter || taskType) && count === 0 && (
          <FilteredItemNotFound title={taskType} />
        )}
      </Box>
    </Box>
  );
};

export default ProjectTasks;
