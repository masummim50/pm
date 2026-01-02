import { Box, Grid, Skeleton } from "@mui/material";
import { blueGrey } from "@mui/material/colors";


const ProjectDetailsLoading = () => {
  return (
    <div>
      <Skeleton height={50} sx={{ bgcolor: blueGrey[500] }} />
      <Skeleton height={50} sx={{ bgcolor: blueGrey[500] }} />
      <br />
      <Skeleton height={20} sx={{ bgcolor: blueGrey[500] }} />
      <Skeleton height={20} sx={{ bgcolor: blueGrey[500] }} />
      <Skeleton height={20} sx={{ bgcolor: blueGrey[500] }} />
      <Grid container spacing={2}>
        <Grid item xs={2}>
          <Skeleton height={55} sx={{ bgcolor: blueGrey[500] }} />
        </Grid>
        <Grid item xs={10}>
          <Skeleton height={55} sx={{ bgcolor: blueGrey[500] }} />
        </Grid>
      </Grid>
      <Grid container spacing={1}>
        <Grid item xs={6}>
          <Skeleton height={55} sx={{ bgcolor: blueGrey[500] }} />
        </Grid>
        <Grid item xs={1}>
          <Skeleton height={55} sx={{ bgcolor: blueGrey[500] }} />
        </Grid>
      </Grid>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <Skeleton
          variant="rectangular"
          height={100}
          sx={{ bgcolor: blueGrey[500], borderRadius: "5px" }}
        />
        <Skeleton
          variant="rectangular"
          height={100}
          sx={{ bgcolor: blueGrey[500], borderRadius: "5px" }}
        />
        <Skeleton
          variant="rectangular"
          height={100}
          sx={{ bgcolor: blueGrey[500], borderRadius: "5px" }}
        />
        <Skeleton
          variant="rectangular"
          height={100}
          sx={{ bgcolor: blueGrey[500], borderRadius: "5px" }}
        />
        <Skeleton
          variant="rectangular"
          height={100}
          sx={{ bgcolor: blueGrey[500], borderRadius: "5px" }}
        />
      </Box>
    </div>
  );
};

export default ProjectDetailsLoading;
