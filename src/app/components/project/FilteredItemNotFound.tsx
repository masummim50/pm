import { Box } from "@mui/material";
import { blueGrey } from "@mui/material/colors";

const FilteredItemNotFound = ({ title }: { title: string }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "200px",
        background: blueGrey[100],
        borderRadius: 2,
      }}
    >
      No {title === "ideal" ? "pending" : title} Task Found
    </Box>
  );
};

export default FilteredItemNotFound;
