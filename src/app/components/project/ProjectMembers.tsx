import { Collapse, Grid, Typography, Box, Paper } from "@mui/material";

import { participantType } from "./project.interface";
import { useGetMembersByProjectIdQuery } from "../../redux/features/project/project.api";
import { useLocation } from "react-router-dom";

const ProjectMembers = ({
  memberBoxVisible,
}: {
  memberBoxVisible: boolean;
}) => {
  const location = useLocation();
  const projectId = location.pathname.split("/")[2];
  const { data } = useGetMembersByProjectIdQuery(projectId);
  return (
    <Collapse in={memberBoxVisible} sx={{ marginTop: 1 }}>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={1}>
          {data?.data?.participants.map((participant: participantType) => (
            <Grid item xs={4} key={participant._id}>
              <Paper sx={{ textAlign: "center", background:'lightGrey' }}>
                <Typography>{participant.name}</Typography>
                <Typography
                  sx={{
                    fontSize: { xs: "10px", sm: "12px" },
                    color: "grey",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: "1",
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {participant.email}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Collapse>
  );
};

export default ProjectMembers;
