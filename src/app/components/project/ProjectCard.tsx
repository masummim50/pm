import React, { useState } from "react";
import { projectType } from "./project.interface";
import {
  Grid,
  Card,
  Typography,
  Box,
  ButtonGroup,
  Chip,
  Button,
} from "@mui/material";
// import {Card} from "@mui/joy";
// import { Button, Typography } from "@mui/joy";
import {
  useDeletePersonalProjectMutation,
  useDeleteTeamProjectMutation,
} from "../../redux/features/project/project.api";
import DeleteIcon from "@mui/icons-material/Delete";
import { useLocation, useNavigate } from "react-router-dom";
import {  blueGrey } from "@mui/material/colors";
import Divider from "@mui/material/Divider";
import EditIcon from "@mui/icons-material/Edit";
import EditProjectModal from "./EditProjectModal";
import Participants from "./Participants";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const ProjectCard = ({
  project,
  time,
}: {
  project: projectType;
  time: number;
}) => {
  const [hidden, setHidden] = useState(true);
  setTimeout(() => {
    setHidden(false);
  }, time);
  const [deleteProject] = useDeletePersonalProjectMutation();
  const [deleteTeamProject] = useDeleteTeamProjectMutation();


  const navigate = useNavigate();

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (project.type == "personal") {
      deleteProject(project._id);
    } else {
      deleteTeamProject(project._id);
    }
  };
  const { pathname } = useLocation();
  const handleGoToDetails = () => {
    navigate(`${pathname + "/" + project._id}`);
  };

  const [openModal, setOpenModal] = React.useState(false);
  const handleOpenModal = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setOpenModal(true);
  };

  const user = useSelector((state: RootState) => state.user);

  return (
    <Grid
      height={"100%"}
      item
      xs={12}
      md={6}
      lg={4}
      sx={{
        opacity: hidden ? 0 : 1,
        transition: "opacity 0.5s ease",
        scale: project.deleting ? 0 : 1,
        cursor: "pointer",
      }}
    >
      <EditProjectModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        project={project}
      />
      <div style={{ textDecoration: "none" }} onClick={handleGoToDetails}>
        <Card
          sx={{
            background: blueGrey[100],
          }}
        >
          <Box
            sx={{
              textAlign: "right",
            }}
          >
            <Chip
              size="small"
              color={
                project.status === "pending"
                  ? "warning"
                  : project.status === "complete"
                  ? "success"
                  : "info"
              }
              label={project.status}
            />
          </Box>
          <Typography component="h2" sx={{
              color: blueGrey[900],
              padding: "5px",
              fontSize: "30px",
              height: "50px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: "1",
              WebkitBoxOrient: "vertical",
            }}>
            {project.name}
          </Typography>
          <Divider />

          <Typography
            sx={{
              color: blueGrey[900],
              padding: "5px",
              fontSize: "15px",
              height: "75px",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: "3",
              WebkitBoxOrient: "vertical",
            }}
          >
            {project.description}
          </Typography>
          <Divider />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {project.type == "team" && (
              <Box sx={{ padding: "15px 10px", marginTop:3 }}>
                <Participants participants={project.participants} />
              </Box>
            )}
            {project.user == user.id && (
              <ButtonGroup sx={{ padding: 1, marginTop:3 }}>
                {/* <IconButton
                  size="small"
                  sx={{
                    background: blueGrey[600],
                    "&:hover": { background: blueGrey[900] },
                  }}
                  onClick={handleOpenModal}
                  >
                  <EditIcon />
                </IconButton> */}
                <Button
                  onClick={handleOpenModal}
                  size="small"
                  variant="outlined"
                  endIcon={<EditIcon />}
                >
                  Edit
                </Button>
                <Button
                  // onClick={handleOpenModal}
                  onClick={handleDelete}
                  size="small"
                  variant="outlined"
                  color="error"
                  endIcon={<DeleteIcon />}
                >
                  Delete
                </Button>
                {/* <IconButton
                  size="small"
                  sx={{
                    background: blueGrey[600],
                    "&:hover": { background: blueGrey[900] },
                  }}
                  onClick={handleDelete}
                >
                  <DeleteIcon sx={{ color: deepOrange[900] }} />
                </IconButton> */}
              </ButtonGroup>
            )}
          </Box>
        </Card>
      </div>
    </Grid>
  );
};

export default ProjectCard;
