import { Box, Button, CircularProgress } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import bg from "../../../assets/images/journal-background.jpg";
import {
  useGetTodayJournalQuery,
  useUpdateJournalMutation,
} from "../../redux/features/journal/journalApi";
import DoneIcon from "@mui/icons-material/Done";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { blueGrey } from "@mui/material/colors";

type functionType = (value: string) => void;

function debounce(func: functionType, delay: number) {
  let timeout: NodeJS.Timeout;
  return function (...args: [value: string]) {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func(...args);
    }, delay);
  };
}
const WriteJournal = () => {
  const {
    data: journalData,
    isLoading: journalDataLoading,
    isSuccess: journalDataFetchSuccess,
  } = useGetTodayJournalQuery(undefined);
  const [performUpdate, setPerformUpdate] = useState(false);

  const [
    updateJournal,
    { data: update, isLoading: updating, isSuccess: updated },
  ] = useUpdateJournalMutation();

  const [journalValue, setJournalValue] = useState(() => {
    if (update?.data) {
      return update.data.content;
    } else if (journalData?.data?.content) {
      return journalData.data.content;
    } else {
      return "";
    }
  });

  const [showSavedButton, setShowSavedButton] = useState(false);
  const [debouncedValue, setDebouncedValue] = useState(journalValue);

  const debouncedUpdate = useCallback(
    debounce((value: string) => {
      updateJournal({ content: { content: value } });
    }, 1500),
    []
  );

  useEffect(() => {
    if (journalData?.data?.content) {
      setJournalValue(journalData?.data?.content);
    }
  }, [journalData]);

  useEffect(() => {
    if (updated) {
      setJournalValue(update?.data?.content);
      setShowSavedButton(true);
      setTimeout(() => {
        setShowSavedButton(false);
      }, 1000);
    }
  }, [updated, update]);

  useEffect(() => {
    if (performUpdate) {
      debouncedUpdate(debouncedValue);
    }
  }, [debouncedValue, debouncedUpdate, performUpdate]);

  const handleOnChange = (value: string) => {
    setPerformUpdate(true);
    setJournalValue(value);
    setDebouncedValue(value);
  };

  const handleAutoType = () => {
    
      handleOnChange(`${journalValue} Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`);
     
  };

  const [parent] = useAutoAnimate();

  return (
    <Box style={{ height: "70vh" }}>
      <div ref={parent} style={{ height: "100%", width: "100%", flex: 1 }}>
        {journalDataLoading && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "300px",
              background: blueGrey[100],
              borderRadius: "10px",
              color: "black",
            }}
          >
            Fetching Journal Data...
          </div>
        )}
        {/* this whole box is the writing area */}
        {journalDataFetchSuccess && (
          <>
          <Button onClick={handleAutoType} style={{}} size="small" variant="contained" color="secondary">add text</Button>
          
          <Box
            style={{
              position: "relative",
              display: "inline-block",
              borderRadius: "10px",
              overflow: "hidden",
              backgroundImage: `url(${bg})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              height: "100%",
              width: "100%",
              backgroundRepeat: "none",
            }}
          >
            {updating && (
              <Button
                sx={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  zIndex: 100,
                  background: "lightgreen",
                  color: "black",
                }}
                size="small"
              >
                Saving ${<CircularProgress size="12px" />}
              </Button>
            )}
            {showSavedButton && (
              <Button
                sx={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  zIndex: 100,
                  background: "lightgreen",
                  color: "black",
                }}
                size="small"
                endIcon={<DoneIcon />}
              >
                Saved
              </Button>
            )}
            
            <textarea
              onChange={(e) => handleOnChange(e.target.value)}
              // defaultValue={data?.data?.content}
              autoFocus={true}
              value={journalValue}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                height: "100%",
                width: "100%",
                resize: "none",
                borderRadius: "10px",
                outline: "none",
                padding: "5px",
                background: "transparent",
                backdropFilter: "blur(30px)", // Set textarea background to transparent
                color: "white",
              }}
            />
          </Box>
          </>
        )}
      </div>
    </Box>
  );
};

export default WriteJournal;
