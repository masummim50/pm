import { Box, Card, Typography } from "@mui/material";
import { blueGrey } from "@mui/material/colors";
import React from "react";

const OverviewCard = ({
  title,
  count,
  children
}: {
  title: string;
  count: string | number;
  children: React.ReactNode
}) => {
  return (
    <Card
      sx={{
        // background: blueGrey[800],
        display: "flex",
        flexDirection: "row",
        justifyContent:'space-between',
        alignItems:'center',
        padding: 1,
        borderRadius: 1,
        minHeight: { xs: 100, sm: "auto" },
      }}
    >
      <Box>
        <Typography sx={{fontSize:{xs:15, sm:18}}}>{title}</Typography>
        <Typography  sx={{ color: blueGrey[400], fontSize: {xs:12, sm:15} }}>
          <p>{count}</p>
        </Typography>
      </Box>
        {children}
    </Card>
  );
};

export default OverviewCard;
