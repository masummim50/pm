

import { BarChart } from "@mui/x-charts/BarChart";
import {  Typography } from "@mui/material";
import { blue } from "@mui/material/colors";
import { SpinnerWithText } from "../loadingSkeletons/SpinnerWithText";

const TodoOverview = ({
  
  isLoading,
  dates,
  values,
}: {
  isLoading:boolean;
  dates:any;
  values:any;
}) => {

  
  



  return (
    <div>
      
      
      {/* <Box>{isLoading && <Skeleton sx={{ margin: 0 }} height={200} />}</Box> */}

      {
        isLoading && <SpinnerWithText height={300} text="Loading todo overview" />
      }

      {dates.length > 0 && (
        <>
        <Typography fontSize={13}>last 30 days Todo Overview</Typography>
          <BarChart
            // colors={[green[500]]}
            xAxis={[
              {
                id: "barCategories",
                data: dates,
                scaleType: "band",
              },
            ]}
            series={[{ data: values, label: "todos completed" , color:blue[400]}]}
            height={300}
          />
        </>
      )}
    </div>
  );
};

export default TodoOverview;
