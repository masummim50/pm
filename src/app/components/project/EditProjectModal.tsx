/* eslint-disable react-hooks/exhaustive-deps */
import * as React from "react";
import { Button, Paper } from "@mui/material";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useState } from "react";
import { TextField } from "@mui/material";
import { TextareaAutosize as BaseTextareaAutosize } from "@mui/base/TextareaAutosize";
import { styled } from "@mui/material/styles";

import { useUpdatePersonalProjectByIdMutation } from "../../redux/features/project/project.api";
import { projectType } from "./project.interface";

const blue = {
  100: "#DAECFF",
  200: "#b6daff",
  400: "#3399FF",
  500: "#007FFF",
  600: "#0072E5",
  900: "#003A75",
};

const grey = {
  50: "#F3F6F9",
  100: "#E5EAF2",
  200: "#DAE2ED",
  300: "#C7D0DD",
  400: "#B0B8C4",
  500: "#9DA8B7",
  600: "#6B7A90",
  700: "#434D5B",
  800: "#303740",
  900: "#1C2025",
};

const Textarea = styled(BaseTextareaAutosize)(
  ({ theme }) => `
    width: 320px;
    font-family: IBM Plex Sans, sans-serif;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
    padding: 8px 12px;
    border-radius: 8px;
    color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
    background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
    border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
    box-shadow: 0px 2px 2px ${
      theme.palette.mode === "dark" ? grey[900] : grey[50]
    };

    &:hover {
      border-color: ${blue[400]};
    }

    &:focus {
      border-color: ${blue[400]};
      box-shadow: 0 0 0 3px ${
        theme.palette.mode === "dark" ? blue[600] : blue[200]
      };
    }

    // firefox
    &:focus-visible {
      outline: 0;
    }
  `
);
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export default function EditProjectModal({
  openModal,
  setOpenModal,
  project,
}: {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  project: projectType;
}) {
  const [updateProject, { isSuccess }] = useUpdatePersonalProjectByIdMutation();

  const handleClose = () => setOpenModal(false);
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description);
  const [isDataDifferent, setIsDataDifferent] = useState(
    project.name === name && project.description === description
  );

  React.useEffect(() => {
    setIsDataDifferent(
      project.name === name && project.description === description
    );
  }, [name, description]);
  const handleUpdateProject = () => {
    updateProject({ id: project._id, data: { name, description } });
  };

  React.useEffect(() => {
    if (isSuccess) {
      handleClose();
    }
  }, [isSuccess]);
  return (
    <div>
      <Modal
        open={openModal}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Paper sx={style}>
          <Typography sx={{ mb: 1 }} color="gray">
            Project Title
          </Typography>
          <TextField
            onChange={(e) => setName(e.target.value)}
            defaultValue={name}
            minRows={3}
            sx={{ maxWidth: "500px", width: "100%", mb: 2 }}
            size="small"
            label="Project Title"
          ></TextField>
          <Typography sx={{ mb: 1 }} color="gray">
            Project Description
          </Typography>
          <Textarea
            onChange={(e) => setDescription(e.target.value)}
            sx={{ maxWidth: "500px", width: "100%" }}
            aria-label="minimum height"
            minRows={5}
            maxRows={8}
            value={description}
            placeholder="Add Description"
          />
          <br />

          <Button
            disabled={isDataDifferent}
            onClick={handleUpdateProject}
            variant="contained"
          >
            Update Project
          </Button>
        </Paper>
      </Modal>
    </div>
  );
}
