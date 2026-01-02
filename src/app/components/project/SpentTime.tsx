import { useEffect, useState } from "react";
import { calcTime } from "../../lib/helpers/timeCal";
import { Typography } from "@mui/material";
import { blue, green, orange } from "@mui/material/colors";

const SpentTime = ({
  time,
  status,
}: {
  time: { startTime: number; totalTime: number };
  status: string;
}) => {
  const [timespent, setTimespent] = useState(time.totalTime);
  useEffect(() => {
      console.log(timespent)
    
    let intervalId: ReturnType<typeof setInterval>;

    if (status === "running") {
      intervalId = setInterval(() => {
        // Calculate the current time inside the interval
        new Date().getTime() - time.startTime + time.totalTime;

        // Update the state using the previous state value
        setTimespent((prevTimespent) => prevTimespent + 1000);
      }, 1000);
    }

    // Cleanup function to clear the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, [status, time.startTime, time.totalTime]);

  return (
    <div>
      {status == "running" ? (
        <Typography sx={{ fontSize: { xs: 10, sm: 12 }, color: orange[600] }}>
          {calcTime(new Date().getTime() - time.startTime + time.totalTime)}
        </Typography>
      ) : (
        <Typography
          sx={{
            fontSize: { xs: 10, sm: 12 },
            color:
              status == "complete"
                ? green[600]
                : status == "paused" ? blue[600] : 'black',
          }}
        >
          Time Spent: {calcTime(time.totalTime)}
        </Typography>
      )}
    </div>
  );
};

export default SpentTime;
