import { useGetJournalOverviewQuery } from "../../redux/features/journal/journalApi";
import { getLast30Days } from "../../lib/dateFunctions";
import { Box, Skeleton, Tooltip, Typography } from "@mui/material";
import { blueGrey } from "@mui/material/colors";

const JournalOverview = () => {
  const { data, isLoading } = useGetJournalOverviewQuery(undefined);

  const lastDates = getLast30Days();

  const chooseBackgroundColor = (date: string) => {
    let opacity = 0;
    const words = data?.data?.data[date];

    if (words) {
      opacity = words / data?.data?.maxWords;
      return `rgba(0, 142, 31, ${opacity})`;
    } else {
      return blueGrey[50];
    }
  };

  return (
    <div>
      <Typography color={"primary"}>Journal Overview:</Typography>
      <Typography color={"primary"} fontSize={13}>
        last 30 days:
      </Typography>
      <Box>{isLoading && <Skeleton sx={{ margin: 0 }} height={400} />}</Box>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {lastDates.map((d, index) => (
          <div
            key={index}
            style={{
              padding: "5px",
              flex: "0 0 calc(7%)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                height: { xs: "25px", sm: "40px" },
                width: "100%",
                cursor: "pointer",
              }}
            >
              <Tooltip
                title={
                  <div>
                    {d} <br /> {data?.data?.data[d] ? data?.data?.data[d] : 0}{" "}
                    words written
                  </div>
                }
              >
                <Box
                  sx={{
                    border: data?.data?.data[d]
                      ? "1px solid lightgreen"
                      : "none",
                    borderRadius: "5px",
                    height: { xs: "25px", sm: "40px" },
                    width: "100%",
                    background: `${chooseBackgroundColor(d)}`,
                  }}
                ></Box>
              </Tooltip>
            </Box>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JournalOverview;
