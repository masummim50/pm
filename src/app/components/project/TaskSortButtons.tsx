import  { useEffect, useState } from "react";
import { taskType } from "./project.interface";
import { Button } from "@mui/material";
import { blueGrey, green } from "@mui/material/colors";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { projectApi } from "../../redux/features/project/project.api";
import { useParams } from "react-router-dom";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import {
  changeType,
  setFilter,
} from "../../redux/features/project/projectSlice";
import { RootState } from "../../redux/store";

const sortButtons = [
  { title: "newest", value: 0 },
  { title: "oldest", value: 1 },
];

const typeButtons = [
  { title: "complete", value: 2 },
  { title: "ideal", value: 3 },
  { title: "paused", value: 4 },
  { title: "running", value: 5 },
]

const TaskSortButtons = ({ type }: { type: string }) => {
  const { filter, taskType } = useAppSelector(
    (state: RootState) => state.filter
  );
  const [sortNumber, setSortNumber] = useState(0);
  function compareFunction(a: taskType, b: taskType) {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);

    if (sortNumber === 0) {
      return dateB.getTime() - dateA.getTime();
    } else if (sortNumber === 1) {
      return dateA.getTime() - dateB.getTime();
    } else if (sortNumber === 2) {
      // Completed first
      if (a.subtasks.length > 0) {
        for (let i = 0; i < a.subtasks.length; i++) {
          if (a.subtasks[i].status !== "complete") {
            return 1;
          }
        }
        return -1;
      } else {
        return a.status === "complete" ? -1 : 1;
      }
    } else if (sortNumber === 3) {
      if (a.subtasks.length > 0) {
        for (let i = 0; i < a.subtasks.length; i++) {
          if (a.subtasks[i].status === "ideal") {
            return -1;
          }
        }
        return 1;
      } else {
        return a.status === "ideal" ? -1 : 1;
      }
      // return a.status === 'pending' ? -1 : 1;
    } else if (sortNumber === 4) {
      // Paused first
      if (a.subtasks.length > 0) {
        for (let i = 0; i < a.subtasks.length; i++) {
          if (a.subtasks[i].status === "paused") {
            return -1;
          }
        }
        return 1;
      } else {
        return a.status === "paused" ? -1 : 1;
      }
    } else if (sortNumber === 5) {
      // Running first
      if (a.subtasks.length > 0) {
        for (let i = 0; i < a.subtasks.length; i++) {
          if (a.subtasks[i].status === "running") {
            return -1;
          }
        }
        return 1;
      } else {
        return a.status === "running" ? -1 : 1;
      }
    }
  }

  const { id } = useParams();
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(
      projectApi.util.updateQueryData("getPersonalProjectById", id, (draft) => {
        draft.data.tasks = draft.data.tasks.sort(compareFunction);
      })
    );
  }, [sortNumber]);

  const handleSortButtonClick = (n:number)=> {
    setSortNumber(n);
  }

  const handleTypeButtonClick = (title: string) => {
    // when it was number:
    // setSortNumber(n);
    if (taskType === title) {
      dispatch(changeType(""));
    } else {
      dispatch(changeType(title));
    }
  };
  const handleFilterMyTask = () => {
    dispatch(setFilter());
  };

  return (
    <div style={{ marginTop: "5px" }}>
      {sortButtons.map((b) => (
        <Button
          disabled={sortNumber === b.value}
          variant="text"
          size="small"
          sx={{
            background: sortNumber === b.value ? blueGrey[500] : blueGrey[100],
            color: "black",
            "&:hover": { background: blueGrey[200] },
            marginRight: 1,
            padding: "0 2px",
            "&:disabled": { color: "white" },
            mt: 1,
          }}
          onClick={() => handleSortButtonClick(b.value)}
          endIcon={<SwapVertIcon />}
        >
          {b.title}
        </Button>
      ))}
      {typeButtons.map((b) => (
        <Button
          variant="text"
          size="small"
          sx={{
            background: taskType === b.title ? blueGrey[500] : blueGrey[100],
            color: "black",
            "&:hover": { background: taskType === b.title ? blueGrey[600] : blueGrey[200] },
            marginRight: 1,
            padding: "0 2px",
            "&:disabled": { color: "white" },
            mt: 1,
          }}
          onClick={() => handleTypeButtonClick(b.title)}
        >
          {b.title === 'ideal' ? 'Pending' : b.title}
        </Button>
      ))}
      {type === "team" && (
        <Button
          variant="text"
          size="small"
          sx={{
            background: filter ? green[800] : green[100],
            color: filter ? "white" : "grey",
            "&:hover": { background: filter ? green[800] : green[100] },
            marginRight: 1,
            padding: "0 2px",
            "&:disabled": { color: "white" },
            mt: 1,
            border: filter ? "1px solid white" : "1px solid transparent",
          }}
          onClick={handleFilterMyTask}
        >
          My TASK
        </Button>
      )}
    </div>
  );
};

export default TaskSortButtons;
