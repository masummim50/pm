import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import { red, lightBlue, orange } from "@mui/material/colors";
import { useDrag } from "react-dnd";
import {
  useCompleteTodoMutation,
  useDeleteTodoMutation,
} from "../../redux/features/todo/todo.api";
import { todoType } from "./todo.interface";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import { isDesktop } from "./TodoContainer";
import { ButtonGroup } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import RemoveDoneIcon from "@mui/icons-material/RemoveDone";
const bgColor = ["", lightBlue[100], orange[100], red[100]];
// const borderColor = ["", lightBlue[500], orange[500], red[500]];

export default function TodoCard({
  todo,
  time,
}: {
  todo: todoType;
  time: number;
}) {
  const ismobile = isDesktop();
  const [hidden, setHidden] = useState(true);
  setTimeout(() => {
    setHidden(false);
  }, time);
  const [deleteTodo, { isSuccess: deleteSuccess, error }] =
    useDeleteTodoMutation();
  const [completeTodo] = useCompleteTodoMutation();
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "todo",
      item: () => {
        return todo;
      },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    [todo]
  );
  const [deletingTodo, setDeletingTodo] = useState(false);
  const [hide, setHide] = useState(false);
  useEffect(() => {
    if (!deleteSuccess || error) {
      setDeletingTodo(false);
    }
  }, [deleteSuccess, error]);

  useEffect(() => {
    if (deletingTodo) {
      setTimeout(() => {
        setHide(true);
      }, 450);
    }
  }, [deletingTodo]);

  const handleDelete = () => {
    // setDeletingTodo(true);
    deleteTodo(todo);
  };
  const handleComplete = () => {
    completeTodo(todo);
  };
  return (
    <div
      style={{
        transform: deletingTodo ? "scale(0)" : "scale(1)",
        transition: "all 0.3s ease",
        display: hide ? "none" : "block",
      }}
      // ref={drag}
    >
      <div ref={drag}>
        <Card
          sx={{
            width: "100%",
            background: bgColor[todo.priority],
            marginBottom: "10px",
            transition: "all 0.5s ease",
            // opacity: isDragging ? "0.2" : "1",
            opacity: hidden ? 0 : isDragging ? 0.2 : 1,
            paddingBottom: hidden ? "0" : "1px",
          }}
        >
          <CardContent
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
            style={{ padding: "3px" }}
          >
            <Typography
              variant="h6"
              component="div"
              sx={{ padding: "1px", fontSize: { xs: 12, sm: 14 } }}
            >
              {todo?.title}
              <br />
              <Typography
                color="gray"
                sx={{ padding: "0px", fontSize: { xs: 10, sm: 12 } }}
              >
                {todo.status
                  ?`Completed on: ${new Date(todo.updatedAt).toDateString()}`
                  : `Created on: ${new Date(todo.createdAt).toDateString()}`}
              </Typography>
            </Typography>
            <ButtonGroup>
              {!ismobile && !todo.status && (
                <IconButton color="error" onClick={handleComplete}>
                  <DoneIcon />
                </IconButton>
              )}
              {!ismobile && todo.status && (
                <IconButton color="error" onClick={handleComplete}>
                  <RemoveDoneIcon />
                </IconButton>
              )}
              <IconButton color="error" onClick={handleDelete}>
                <DeleteIcon />
              </IconButton>
            </ButtonGroup>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
