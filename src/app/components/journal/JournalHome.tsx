import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import WriteJournal from "./WriteJournal";
import ViewJournal from "./ViewJournal";
import useDocumentTitle from "../../../UseDocumentTitle";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Box>{children}</Box>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function JournalHome() {
  
  useDocumentTitle({title:'Journal'})
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    console.log(event)
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", ".css-19kzrtu": {padding:"24px 0 0 0"}}}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          indicatorColor="secondary"
          textColor="inherit"
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Today" {...a11yProps(0)} />
          <Tab label="My Journals" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <WriteJournal />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <ViewJournal />
      </CustomTabPanel>
    </Box>
  );
}
