import  { useEffect, useState } from "react";
import { taskType } from "./project.interface";
import { Button } from "@mui/material";
import { blueGrey } from "@mui/material/colors";
import { useAppDispatch } from "../../redux/hooks";
import { projectApi } from "../../redux/features/project/project.api";
import { useParams } from "react-router-dom";
import SwapVertIcon from "@mui/icons-material/SwapVert";
const sortButtons = [
  { title: "newest", value: 0 },
  { title: "oldest", value: 1 },
];

const SubtaskSortButtons = ({taskIndex}:{taskIndex:number}) => {
  const [sortNumber, setSortNumber] = useState(0);
  function compareFunction(a: taskType, b: taskType) {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);

    if (sortNumber === 0) {
        return dateB.getTime() - dateA.getTime();
    } else if (sortNumber === 1) {
        return dateA.getTime() - dateB.getTime();
    }
  }
  const { id } = useParams();
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(
      projectApi.util.updateQueryData("getPersonalProjectById", id, (draft) => {
        draft.data.tasks[taskIndex].subtasks = draft.data.tasks[taskIndex].subtasks.sort(compareFunction);
      })
    );
  }, [sortNumber]);

  const handleSortButtonClick = (n: number) => {
    setSortNumber(n);
  };

  return (
    <div style={{ margin: "5px 0" }}>
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
            fontSize:8
          }}
          onClick={() => handleSortButtonClick(b.value)}
          endIcon={<SwapVertIcon />}
        >
          {b.title}
        </Button>
      ))}
    </div>
  );
};

export default SubtaskSortButtons;
