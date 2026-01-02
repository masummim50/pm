import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ProjectTasks from "./ProjectTasks";

import { useGetPersonalProjectByIdQuery } from "../../redux/features/project/project.api";
import AddMember from "./AddMember";
import ProjectDetailsLoading from "../loadingSkeletons/ProjectDetailsLoading";

const ProjectDetails = () => {
  const { id } = useParams();
  const { data, isLoading, error } = useGetPersonalProjectByIdQuery(id);
  return (
    <Box>
      {isLoading && <ProjectDetailsLoading />}
      {data?.success && (
        <>
          <Typography fontSize={30}>{data?.data?.name}</Typography>
          <Accordion sx={{ marginBottom: "10px" }}>
            <AccordionSummary
              sx={{
                "&.MuiAccordionSummary-content": { padding: 0, margin: 0 },
              }}
              expandIcon={<ExpandMoreIcon />}
            >
              <Typography>Description</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <pre style={{ wordWrap: "break-word", whiteSpace: "pre-wrap" }}>
                {data?.data?.description}
              </pre>
            </AccordionDetails>
          </Accordion>
          {data?.data?.type == "team" && <AddMember project={data?.data} />}
          <ProjectTasks project={data?.data} />
        </>
      )}
      {error && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "200px",
            borderRadius: 2,
          }}
        >
          An Unknown Error Occured
        </Box>
      )}
    </Box>
  );
};

export default ProjectDetails;
