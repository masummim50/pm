/* eslint-disable @typescript-eslint/no-unused-vars */

import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Box, Grid, Tooltip } from "@mui/material";
import { useDrop } from "react-dnd/dist/hooks";
import Badge from "@mui/material/Badge";
import { todoType } from "./todo.interface";
import {
  useCompleteTodoMutation,
  useDeleteAllCompletedTodosMutation,
} from "../../redux/features/todo/todo.api";
import TodoCard from "./TodoCard";
import Typography from "@mui/material/Typography";
import { LoadingButton } from "@mui/lab";
import DeleteIcon from "@mui/icons-material/Delete";
import { blueGrey, green } from "@mui/material/colors";

export type itemType = { id: string; status: boolean };
const CompleteSection = ({
  todos,
  pendingCount,
}: {
  todos: todoType[];
  pendingCount: number;
}) => {
  const [parent] = useAutoAnimate(/* optional config */);
  const [completeTodo] = useCompleteTodoMutation();
  const [deleteAllTodo, { isLoading: deletingAll }] =
    useDeleteAllCompletedTodosMutation();
  const [_,drop] = useDrop(() => ({
    accept: "todo",
    drop: (item: itemType) => handleDrop(item),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));
  const handleDrop = (item: itemType) => {

    if (!item.status) {
      completeTodo(item);
    }
  };

  const handleDeleteAll = () => {
    deleteAllTodo(undefined);
  };

  return (
    <Grid item xs={6}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          background: green[400],
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
          Completed{" "}
          <Badge
            sx={{ marginLeft: 1, color: "white", background: "red" }}
            badgeContent={todos?.filter((todo: todoType) => todo?.status).length}
          />
        </Typography>
        <LoadingButton
          sx={{
            background: "red",
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
          {todos?.length === 0 && pendingCount > 0 && (
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
              Drag a todo to this section
            </Box>
          )}
          {todos?.map((todo: todoType, index) => (
            <TodoCard key={todo._id} time={100 * index} todo={todo} />
          ))}
        </div>
      </div>
    </Grid>
  );
};

export default CompleteSection;
