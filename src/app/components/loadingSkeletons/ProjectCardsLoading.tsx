import { Grid, Skeleton } from "@mui/material";
import { blueGrey } from "@mui/material/colors";

const ProjectCardsLoading = () => {
  return (
    <Grid container spacing={2}>
      {Array(10)
        .fill("")
        .map((_, index) => (
          <Grid key={index} item xs={12} md={4}>
            <Skeleton
            variant="rectangular"
              width="100%"
              height={200}
              sx={{ bgcolor: blueGrey[700], margin:0, padding:0, borderRadius:'5px' }}
            />
          </Grid>
        ))}
    </Grid>
  );
};

export default ProjectCardsLoading;
