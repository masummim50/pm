import { Link } from "react-router-dom";
import { useGetPersonalProjectsQuery } from "../../redux/features/project/project.api";
import { projectType } from "./project.interface";
import ProjectCard from "./ProjectCard";
import { Grid, Box, Button, Typography } from "@mui/material";
import Add from "@mui/icons-material/Add";
import { styled } from "@mui/material/styles";
import ProjectCardsLoading from "../loadingSkeletons/ProjectCardsLoading";
import NoItemFound from "./NoItemFound";
import useDocumentTitle from "../../../UseDocumentTitle";

export const ResponsiveTypography = styled("p")(({ theme }) => ({
  [theme.breakpoints.down("md")]: {
    fontSize: "4px",
  },
  [theme.breakpoints.up("md")]: {
    fontSize: "5px",
  },
  [theme.breakpoints.up("lg")]: {
    fontSize: "18px",
  },
}));

const responsiveFontSize = {
  lg: 15,
  md: 12,
  xs: 10,
};

const PersonalProjectHome = () => {
  
  useDocumentTitle({title:'Personal Projects'})
  const { data, isLoading } = useGetPersonalProjectsQuery(undefined);
  return (
    <div>
      <Box>
        <Link
          style={{ textDecoration: "none", color: "white" }}
          to="/personalprojects/createnew"
        >
          <Button variant="contained" endIcon={<Add />}>
            create new
          </Button>
        </Link>
      </Box>

      <br />
      <Box sx={{ display: "flex", gap: 1, marginBottom: "5px" }}>
        <Typography
          sx={{
            background: "lightgray",
            display: "inline-block",
            padding: { lg: "2xp 10px", xs: "2px 4px" },
            borderRadius: "5px",
            fontSize: responsiveFontSize,
          }}
        >
          {data?.data?.length} total projects
        </Typography>
        <Typography
          variant="caption"
          sx={{
            background: "#00b0ff",
            display: "inline-block",
            padding: "2px 10px",
            borderRadius: "5px",
            fontSize: responsiveFontSize,
          }}
        >
          {
            data?.data?.filter(
              (project: projectType) => project.status === "pending"
            ).length
          }{" "}
          pending projects
        </Typography>
        <Typography
          variant="caption"
          sx={{
            background: "#76ff03",
            display: "inline-block",
            padding: "2px 10px",
            borderRadius: "5px",
            fontSize: responsiveFontSize,
          }}
        >
          {
            data?.data?.filter(
              (project: projectType) => project.status === "complete"
            ).length
          }{" "}
          completed projects
        </Typography>
      </Box>
      <div>
        {isLoading && <ProjectCardsLoading />}
        {data?.data?.length === 0 && <NoItemFound title="Project" />}
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2}>
            {data?.data?.map((project: projectType, index: number) => (
              <ProjectCard
                time={100 * index + 1}
                key={project._id}
                project={project}
              />
            ))}
          </Grid>
        </Box>
      </div>
    </div>
  );
};

export default PersonalProjectHome;
