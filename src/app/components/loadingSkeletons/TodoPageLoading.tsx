import { Grid, Skeleton } from "@mui/material";
import { blueGrey } from "@mui/material/colors";


const TodoPageLoading = () => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={6}>
        <Skeleton
          sx={{ bgcolor: blueGrey[400], borderRadius: "5px", marginBottom: 1 }}
          variant="rectangular"
          height={40}
        />
        {Array(10)
          .fill("")
          .map((_, index) => (
            <Skeleton
              key={index}
              sx={{
                bgcolor: blueGrey[700],
                borderRadius: "5px",
                marginBottom: 1,
              }}
              variant="rectangular"
              height={40}
            />
          ))}
      </Grid>
      <Grid item xs={6}>
        <Skeleton
          sx={{ bgcolor: blueGrey[400], borderRadius: "5px", marginBottom: 1 }}
          variant="rectangular"
          height={40}
        />
        {Array(10)
          .fill("")
          .map((_, index) => (
            <Skeleton
              key={index}
              sx={{
                bgcolor: blueGrey[700],
                borderRadius: "5px",
                marginBottom: 1,
              }}
              variant="rectangular"
              height={40}
            />
          ))}
      </Grid>
    </Grid>
  );
};

export default TodoPageLoading;
