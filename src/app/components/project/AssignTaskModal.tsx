import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useGetMembersByProjectIdQuery } from "../../redux/features/project/project.api";
import { LinearProgress, Paper } from "@mui/material";
import { useAssignTaskMutation } from "../../redux/features/task/taskApi";
import { useAssignSubTaskMutation } from "../../redux/features/subtask/subtaskApi";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  height: "80vh",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: "5px",
  overflow: "auto",
  "&::-webkit-scrollbar": {
    width: "5px",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "#888",
  },
};

export default function AssignTaskModal({
  projectId,
  taskid,
  taskIndex,
  type,
  subtaskid,
  subtaskIndex,
}: {
  projectId: string;
  taskid: string;
  taskIndex: number;
  type: "task" | "subtask";
  subtaskid?: string;
  subtaskIndex?: number;
}) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { data } = useGetMembersByProjectIdQuery(projectId);
  // console.log("data", data);
  const [
    assigntask,
    {
      isSuccess: taskAssignedSuccess,
    },
  ] = useAssignTaskMutation();
  const [
    assignsubtask,
    {
      isSuccess: subtaskAssignedSuccess,
    },
  ] = useAssignSubTaskMutation();

  const [memberId, setMemberId] = React.useState("");
  const handleAssigntask = (userid: string) => {
    setMemberId(userid);
    switch (type) {
      case "task":
        assigntask({ projectid: projectId, taskid, userid, taskIndex });
        break;
      case "subtask":
        if (subtaskid && subtaskIndex !== undefined) {
          assignsubtask({
            projectid: projectId,
            taskid,
            subtaskid,
            userid,
            taskindex: taskIndex,
            subtaskindex: subtaskIndex,
          });
        }
        break;
    }
  };

  React.useEffect(() => {
    if (taskAssignedSuccess || subtaskAssignedSuccess) {
      handleClose();
    }
  }, [taskAssignedSuccess, subtaskAssignedSuccess]);
  // console.log('task assign data:', taskUpdateData)
  return (
    <div>
      <Button
        size="small"
        variant="text"
        color="warning"
        onClick={handleOpen}
      >
        Assign Task
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Select member
          </Typography>
          {/* <Participants participants={data?.data?.participants}/> */}
          {data?.data?.participants.map(
            (p: { _id: string; name: string; email: string }) => (
              <Box>
                <Paper
                  key={p._id}
                  onClick={() => handleAssigntask(p._id)}
                  sx={{
                    marginBottom: 1,
                    p: 1,
                    cursor: "pointer",
                    "&:hover": { boxShadow: 3 },
                  }}
                >
                  <Typography component="p">{p.name}</Typography>
                  <Typography component="span" sx={{ color: "grey" }}>
                    {p.email}
                  </Typography>
                  <Box sx={{ opacity: memberId == p._id ? 1 : 0 }}>
                    <LinearProgress />
                  </Box>
                </Paper>
              </Box>
            )
          )}
        </Box>
      </Modal>
    </div>
  );
}
