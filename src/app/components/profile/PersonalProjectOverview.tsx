import {  useEffect, useState } from "react";
import { useGetPersonalProjectsOverviewQuery } from "../../redux/features/project/project.api";
import { formatDataArray } from "../../lib/dateFunctions";
import { BarChart } from "@mui/x-charts";
import { Skeleton, Typography } from "@mui/material";
import { Box } from "@mui/material";

const PersonalProjectOverview = ({
  showRandom,
}: {
  showRandom: boolean;
}) => {
  const { data, isLoading } = useGetPersonalProjectsOverviewQuery(undefined);

  const [dates, setDates] = useState<string[]>([]);
  const [values, setValues] = useState<number[]>([]);
  const [randomValue] = useState<number[]>(() =>
    Array.from({ length: 30 }, () => Math.floor(Math.random() * 21))
  );

  useEffect(() => {
    if (data?.data) {
      const { dates, values } = formatDataArray(data?.data);
      // console.log(dates, values);
      setDates(dates);
      if (showRandom) {
        setValues(randomValue);
      } else {
        setValues(values);
      }
    }
  }, [data, showRandom]);

  return (
    <div>
      <Typography >Tasks Overview:</Typography>
      <Typography fontSize={13}>
        last 30 days:
      </Typography>
      <Box>{isLoading && <Skeleton sx={{ margin: 0 }} height={400} />}</Box>
      {data && (
        <BarChart
          xAxis={[{ id: "sl", scaleType: "band", data: dates }]}
          series={[{ data: values, label: "completed tasks" }]}
          height={300}
        />
      )}
    </div>
  );
};

export default PersonalProjectOverview;
