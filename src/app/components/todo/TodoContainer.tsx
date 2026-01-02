import { useGetTodosQuery } from "../../redux/features/todo/todo.api";
import Grid from "@mui/material/Grid";
import { DndProvider } from "react-dnd/dist/core";
import { HTML5Backend } from "react-dnd-html5-backend";

import CompleteSection from "./CompleteSection";
import PendingSection from "./PendingSection";
import TodoPageLoading from "../loadingSkeletons/TodoPageLoading";
import { blueGrey } from "@mui/material/colors";
import { Box } from "@mui/material";
export const isDesktop = () => {
  const userAgent = navigator.userAgent;
  return !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    userAgent
  );
};
const TodoContainer = () => {
  const {
    data: todos,
    isLoading,
    isSuccess,
  } = useGetTodosQuery(undefined);

  return (
    <div>
      {isLoading ? (
        <TodoPageLoading />
      ) : todos?.data?.pending.length === 0 &&
        todos?.data?.completed.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "200px",
            background: blueGrey[100],
            borderRadius: 2,
            // color:"white",
          }}
        >
          No todo has been added yet.
        </Box>
      ) : (
        isSuccess && 
          
        
        <DndProvider backend={HTML5Backend}>
          <Grid container spacing={2}>
            <PendingSection
              todos={todos?.data?.pending}
              completedCount={todos?.data?.completed.length}
            />
            <CompleteSection
              todos={todos?.data?.completed}
              pendingCount={todos?.data?.pending.length}
            />
          </Grid>
        </DndProvider>
      )}
    </div>
  );
};

export default TodoContainer;
