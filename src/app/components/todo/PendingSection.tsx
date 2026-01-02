/* eslint-disable @typescript-eslint/no-unused-vars */

import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Box, Grid, IconButton, Tooltip } from "@mui/material";
import { useDrop } from "react-dnd/dist/hooks";
import Badge from "@mui/material/Badge";
import { todoType } from "./todo.interface";
import {
  useCompleteTodoMutation,
  useDeleteAllPendingTodosMutation,
} from "../../redux/features/todo/todo.api";
import TodoCard from "./TodoCard";
import Typography from "@mui/material/Typography";
import { itemType } from "./CompleteSection";
import { useState } from "react";
import { LoadingButton } from "@mui/lab";
import DeleteIcon from "@mui/icons-material/Delete";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import { blueGrey, red } from "@mui/material/colors";

const PendingSection = ({
  todos,
  completedCount,
}: {
  todos: todoType[];
  completedCount: number;
}) => {
  const [sortNumber, setSortNumber] = useState(0);

  function compareFunction(a: todoType, b: todoType) {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    switch (sortNumber) {
      case 0:
        return dateB.getTime() - dateA.getTime();
      case 1:
        return dateA.getTime() - dateB.getTime();
      case 2:
        return a.priority - b.priority;
      case 3:
        return b.priority - a.priority;
      default:
        return 1;
    }
  }

  const handleSortClicked = () => {
    if (sortNumber == 3) {
      setSortNumber(0);
    } else {
      setSortNumber((prev) => prev + 1);
    }
  };

  const [parent] = useAutoAnimate(/* optional config */);
  const [completeTodo] = useCompleteTodoMutation();
  const [deleteAllPending, { isLoading: deletingAll }] =
    useDeleteAllPendingTodosMutation();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, drop] = useDrop(() => ({
    accept: "todo",
    drop: (item: itemType) => handleDrop(item),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));
  const handleDrop = (item: itemType) => {
    if (item.status) {
      completeTodo(item);
    }
  };
  const handleDeleteAll = () => {
    deleteAllPending(undefined);
  };

  return (
    <Grid item xs={6}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          background: red[400],
          textAlign: "center",
          marginBottom: "5px",
          borderRadius: "5px",
          color: "white",
          padding: "10px 0",
        }}
      >
        <Typography
          style={{
            flex: 1,
          }}
        >
          <Tooltip
            title={
              sortNumber === 0
                ? "Newest First"
                : sortNumber === 1
                ? "Oldest First"
                : sortNumber === 2
                ? "Low Priority"
                : "High Priority"
            }
          >
            <IconButton
              onClick={handleSortClicked}
              size="small"
              sx={{
                background: "white",
                marginRight: "2px",
                minWidth: "auto",
                padding: "1px",
                borderRadius: "50%",
                "&:hover": { background: "white" },
              }}
            >
              <SwapVertIcon />
            </IconButton>
          </Tooltip>
          Pending{" "}
          <Badge
            sx={{ marginLeft: 1, color: "white", background: "green" }}
            badgeContent={
              todos?.filter((todo: todoType) => !todo.status).length
            }
          />
        </Typography>
        <LoadingButton
          sx={{
            background: "green",
            marginRight: "2px",
            minWidth: "auto",
            padding: "5px",
            borderRadius: "50%",
            "&:hover": { background: "darkgreen" },
          }}
          loading={deletingAll}
          onClick={handleDeleteAll}
        >
          <Tooltip title="delete all">
            <DeleteIcon
              sx={{ fontSize: "20px", color: "white", borderRadius: "50%" }}
            />
          </Tooltip>
        </LoadingButton>
      </Box>

      <div ref={drop} style={{ minHeight: "400px", height: "100%" }}>
        <div ref={parent}>
          {todos?.length === 0 && completedCount > 0 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "200px",
                background: blueGrey[100],
                borderRadius: 2,
              }}
            >
              All todo completed <br /> congrats!
            </Box>
          )}
          {[...todos]?.sort(compareFunction).map((todo: todoType, index) => (
            <TodoCard key={todo._id} time={50 * index} todo={todo} />
          ))}
        </div>
      </div>
    </Grid>
  );
};

export default PendingSection;
