import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { Button, TextField, Typography } from "@mui/material";
import { TextareaAutosize as BaseTextareaAutosize } from "@mui/base/TextareaAutosize";
import { styled } from "@mui/material/styles";
import { useLocation, useNavigate } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import {
  useCreatePersonalProjectMutation,
  useCreateTeamProjectMutation,
} from "../../redux/features/project/project.api";

import { getCurrentTimeString } from "../../lib/dateFunctions";

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

const CreateProject = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [
    createTeamProject,
    { isSuccess: teamCreateSuccess, isLoading: teamCreateLoading },
  ] = useCreateTeamProjectMutation();
  const [
    createPersonalProject,
    { isSuccess: personalCreateSuccess, isLoading: personalCreateLoading },
  ] = useCreatePersonalProjectMutation();
  const { pathname } = useLocation();
  const redirectionUrl = pathname.split("/")[1];

  const handleCreateProject = () => {
    if (redirectionUrl == "teamprojects") {
      createTeamProject({ name, description });
    } else {
      createPersonalProject({ name, description });
    }
  };
  useEffect(() => {
    if (teamCreateSuccess || personalCreateSuccess) {
      navigate(`/${redirectionUrl}`);
    }
  }, [teamCreateSuccess, personalCreateSuccess]);

  const handleRandom=()=>{
    setName(`Project -- ${getCurrentTimeString()}`);
    setDescription(`Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse `);
  }

  return (
      
    <Box>
      <Typography sx={{ mb: 1 }} color="gray">
        Project Title
      </Typography>
      <TextField
        onChange={(e) => setName(e.target.value)}
        defaultValue={name}
        // minRows={3}
        value={name}
        placeholder="Add Project Title"
        sx={{ maxWidth: "500px", width: "100%", mb: 2}}
        size="small"
        label="Project Title"
      ></TextField>
      <Typography sx={{ mb: 1 }} color="gray">
        Project Description
      </Typography>
      <Textarea
      value={description}
        onChange={(e) => setDescription(e.target.value)}
        sx={{ maxWidth: "500px", width: "100%" }}
        aria-label="minimum height"
        minRows={5}
        maxRows={8}
        placeholder="Add Description"
      />
      <br />
      <LoadingButton
      // sx={{background:'white', color:'black', "&:hover": {background:blueGrey[100], color:'black'}}}
        loading={teamCreateLoading || personalCreateLoading}
        onClick={handleCreateProject}
        variant="contained"
      >
        Create Project
      </LoadingButton>
      <Button variant="contained" color="secondary" onClick={handleRandom}>Random</Button>
    </Box>
    
  );
};

export default CreateProject;
