/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { KeyboardEvent, useState } from "react";
import {
  useAddNoteToJournalMutation,
  useDeleteNoteByIdMutation,
  useGetJournalDatesQuery,
  useLazyGetJournalByDateQuery,
} from "../../redux/features/journal/journalApi";
import {
  Box,
  IconButton,
  InputAdornment,
  LinearProgress,
  TextField,
  Typography,
} from "@mui/material";
import { blueGrey } from "@mui/material/colors";
import AddIcon from "@mui/icons-material/Add";
import bg from "../../../assets/images/journal-background.jpg";
import DeleteIcon from "@mui/icons-material/Delete";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useAutoAnimate } from "@formkit/auto-animate/react";

const lastDays: string[] = [];

for (let i = 1; i <= 31; i++) {
  const today = new Date();
  const current = new Date();
  today.setDate(current.getDate() - i);
  lastDays.push(today.toISOString().split("T")[0]);
}

const ViewJournal = () => {
  const {
    data: dates,
    isLoading: journalDatesLoading,
    isSuccess: journalDatesFetchSuccess,
  } = useGetJournalDatesQuery(undefined);
  const [
    getJournalByDate,
    {
      data: journalByDate,
      isSuccess: journalByDateSuccess,
    },
  ] = useLazyGetJournalByDateQuery();
  const [addNoteToJournal, { isLoading:addingNoteToJournal }] = useAddNoteToJournalMutation();
  const [deleteNote] = useDeleteNoteByIdMutation();
  // const [selectedDate, setSelectedDate] = useState(null);
  // const [noData, setNoData] = useState(true);
  const [noteValue, setNoteValue] = useState("");


  // useEffect(() => {
  //   const index = data?.data?.find((d) => d.date === selectedDate);
  //   if (index) {
  //     setNoData(false);
  //     getJournalByDate(selectedDate);
  //   } else {
  //     setNoData(true);
  //   }
  // }, [selectedDate]);

  const handleKeyDown = (e:KeyboardEvent<HTMLInputElement>) => {
    if (e.key == "Enter") {
      addNoteToJournal({
        journalId: journalByDate?.data?._id,
        content: noteValue,
        date: journalByDate?.data?.date,
      });
      setNoteValue("")
    }
  };
  const handleDeleteNote = (noteid: string) => {
    deleteNote({
      journalId: journalByDate?.data?._id,
      noteId: noteid,
      date: journalByDate?.data?.date,
    });
  };


  const [date, setDate] = React.useState("");

  const [fetchingJournal, setFetchingJournal] = useState(false);

  const handleChange = async(event:SelectChangeEvent<string>) => {
    setFetchingJournal(true);
    setDate(event.target.value);
    try {
      
     await getJournalByDate(event.target.value);
    } finally{
      setFetchingJournal(false);
    }
  };


  const [parent] = useAutoAnimate();
  return (
    <div>
      <div ref={parent}>
        {journalDatesLoading && <div> loading... </div>}
        {journalDatesFetchSuccess && (
            <Box>
              {
                dates?.data?.length === 0 ? <div style={{height:'200px', display:'flex', justifyContent:'center', alignItems:'center', width:'100%', background:blueGrey[200], borderRadius:'5px'}}>You haven't wrote anything yet</div>
              :
              <FormControl fullWidth size="small">
                <InputLabel id="demo-select-small-label">
                  Select Date
                </InputLabel>
                <Select
                  labelId="demo-select-small-label"
                  id="demo-select-small"
                  value={date}
                  label="Select Date"
                  onChange={handleChange}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: "200px",
                        scrollbarWidth: "thin", // For Firefox
                      },
                    },
                  }}
                >
                  {dates?.data?.map((d:any) => (
                    <MenuItem value={d.date}>{d.date}</MenuItem>
                  ))}
                </Select>
              </FormControl>
}
            </Box>
        )}
      </div>

      {/* <div>last 30 days: {selectedDate}</div>
      <Grid container spacing={2}>
        {lastDays.map((day, index) => (
          <Grid
            onClick={() => setSelectedDate(day)}
            key={index}
            item
            xs={2}
            sm={1}
            sx={{ cursor: "pointer" }}
          >
            <Tooltip title={day} arrow>
              <div
                style={{
                  height: "20px",
                  width: "20px",
                  background: (() => {
                    const index = data?.data?.find((d) => d.date === day);
                    return index ? "lightgreen" : blueGrey[800];
                  })(),
                  borderRadius: "2px",
                  border: day == selectedDate ? "1px solid green" : "none",
                }}
              ></div>
            </Tooltip>
          </Grid>
        ))}
      </Grid> */}

      <div ref={parent}>
        {fetchingJournal && <div>loading.... </div>}
        {journalByDate?.data?.content && journalByDateSuccess && !fetchingJournal && (
          <Box>
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
                marginTop: "15px",
              }}
            >
              <Box
                sx={{
                  height: "100%",
                  width: "100%",
                  backdropFilter: "blur(20px)",
                  padding: journalByDate?.data?.content ? "10px" : 0,
                  fontSize: {xs:10, sm:15}
                }}
              >
                <pre
                  style={{
                    whiteSpace: "pre-wrap",
                    wordWrap: "break-word",
                    color: "white",
                  }}
                >
                  {journalByDate?.data?.content}
                </pre>
                {/* <div style={{whiteSpace: "pre-wrap"}}>{journalByDate?.data?.content}</div> */}
              </Box>
            </Box>

              <TextField
                value={noteValue}
                onKeyDown={(e:KeyboardEvent<HTMLInputElement>) => handleKeyDown(e)}
                onChange={(e) => setNoteValue(e.target.value)}
                size="small"
                placeholder="Add Notes"
                
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <AddIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <Box sx={{maxWidth:'240px',opacity:addingNoteToJournal ? 1 :0}}>
                <LinearProgress color="secondary"/>
              </Box>
          </Box>
        )}

        {/* {journalByDate?.data && (
        <ThemeProvider theme={whiteInputTheme}>
          <TextField
            value={noteValue}
            onKeyDown={(e) => handleKeyDown(e)}
            onChange={(e) => setNoteValue(e.target.value)}
            size="small"
            placeholder="Add Notes"
            sx={{
              color: "white",
              ...formStyle("white", "white", "white", "white", "white"),
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "white",
                  color: "white",
                },
                "&:hover fieldset": {
                  borderColor: "white",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "white",
                },
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <AddIcon sx={{ color: "white" }} />
                </InputAdornment>
              ),
            }}
          />
        </ThemeProvider>
      )} */}
        <br />
        {/* {
        journalByDate?.data?.notes?.length > 0 ? 'note found' : 'no note added'
      } */}
        {journalByDate?.data?.content && !fetchingJournal &&
          journalByDate?.data?.notes?.map(
            (note: { _id: string; content: string; addedOn: string }) => (
              <Box
                key={note._id}
                sx={{
                  background: blueGrey[100],
                  padding: "5px",
                  marginBottom: "5px",
                  borderRadius: "5px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{fontSize:16}}>{note.content}</Typography>
                  <Typography sx={{ fontSize: 10, color: "grey" }}>
                    Added On: {note.addedOn.split("GMT")[0]}
                  </Typography>
                </Box>
                <IconButton onClick={() => handleDeleteNote(note._id)}>
                  <DeleteIcon sx={{ color: "red", cursor: "pointer" }} />
                </IconButton>
              </Box>
            )
          )}
      </div>
    </div>
  );
};

export default ViewJournal;
