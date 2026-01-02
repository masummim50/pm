/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Card,
  CircularProgress,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useLazySearchUsersQuery } from "../../redux/features/user/userApi";
import { participantType, projectType } from "./project.interface";

import { useLocation } from "react-router-dom";
import { useAddMemberToProjectMutation } from "../../redux/features/project/project.api";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ProjectMembers from "./ProjectMembers";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { LoadingButton } from "@mui/lab";

export const formStyle = (
  labelFocusedColor: string,
  OutlineBorder: string,
  OutlineColor: string,
  nothedOutlineColor: string,
  OutlineFocusedBorderColor: string
) => {
  return {
    "& label.Mui-focused": { color: labelFocusedColor },
    "& .MuiOutlinedInput-root": {
      borderColor: OutlineBorder,
      color: OutlineColor,
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: nothedOutlineColor,
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: OutlineFocusedBorderColor,
      borderWidth: "2px",
    },
  };
};

const AddMember = ({ project }: { project: projectType }) => {
  const { participants } = project;
  const searchRef = useRef<HTMLInputElement>();
  const [searchText, setSearchText] = useState("");
  const [getSearchedUser, { data }] = useLazySearchUsersQuery();

  function debounce(func: any, timeout = 500) {
    let timer: any;
    return (...args: any[]) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func(...args);
      }, timeout);
    };
  }
  function saveInput() {
    if (searchRef.current) {
      setSearchText(searchRef.current.value);
    }
  }
  const processChange = debounce(() => saveInput());

  const [searchingUser, setSearchingUser] = useState(false);
  useEffect(() => {
    const handleLoadingState = async () => {
      setSearchingUser(true);
      await getSearchedUser(searchText);
      setSearchingUser(false);
    };
    if (searchText) {
      handleLoadingState();
    }
  }, [searchText]);

  // handle click outside stuff
  const [searchResultHidden, setSearchResultHidden] = useState(false);

  function useOutsideAlerter(ref: any) {
    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (ref.current && !ref.current.contains(event.target)) {
          setSearchResultHidden(true);
        } else {
          setSearchResultHidden(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }

  const componentRef = useRef(null);
  useOutsideAlerter(componentRef);

  const [addMember, { isLoading: addMemberLoading }] =
    useAddMemberToProjectMutation();
  const location = useLocation();
  const [addMemberId, setAddMemberId] = useState("");
  const handleAddMember = (member: participantType) => {
    setAddMemberId(member._id);
    const projectId = location.pathname.split("/")[2];
    const memberId = member._id;
    addMember({ projectId, memberId });
  };

  const [memberBoxVisible, setMemberBoxVisible] = useState(false);
  const user = useSelector((state: RootState) => state.user);
  return (
    <>
      {project.user == user.id && (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Box sx={{}}>
            <Paper
              onClick={() => setMemberBoxVisible(!memberBoxVisible)}
              elevation={3}
              sx={{
                height: "100%",
                alignItems: "center",
                display: "flex",
                padding: "0 10px",
                cursor: "pointer",
              }}
            >
              Members{" "}
              <span
                style={{
                  background: "lightgrey",
                  padding: "2px",
                  borderRadius: "50%",
                  height: "25px",
                  width: "25px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: "3px",
                }}
              >
                {participants.length}
              </span>
            </Paper>
          </Box>
          <Box sx={{ flex: 1 }} ref={componentRef}>
              <TextField
                fullWidth
                size="small"
                autoComplete="off"
                
                label="search member"
                inputRef={searchRef}
                onChange={processChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start">
                      {searchingUser && <CircularProgress size={"18px"} />}
                    </InputAdornment>
                  ),
                }}
              />
            <Box
              sx={{
                // display: searchResultHidden ? 'none' : 'block',
                scale: searchResultHidden ? 0 : 1,
                opacity: searchResultHidden ? 0 : 1,
                transition: "all ease 0.4s",
                position: "absolute",
                background: "white",
                zIndex: 100,
                marginTop: 1,
                borderRadius: "5px",
              }}
            >
              {!!data?.data.length &&
                searchText &&
                data.data.map((d: any) => (
                  <Card
                    key={d._id}
                    sx={{
                      padding: "0 20px",
                      marginBottom: 1,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <div>
                      <Typography>{d.name}</Typography>
                      <Typography sx={{ color: "lightgray", fontSize: 14 }}>
                        {d.email}
                      </Typography>
                    </div>

                    {participants.some((p) => p === d._id) ? (
                      <IconButton>
                        <CheckCircleIcon />
                      </IconButton>
                    ) : (
                      <LoadingButton
                        loading={addMemberLoading && addMemberId == d._id}
                        onClick={() => handleAddMember(d)}
                        size="small"
                        variant="contained"
                      >
                        Add Member
                      </LoadingButton>
                    )}
                  </Card>
                ))}
              {data?.data.length == 0 && searchText && (
                <Card>0 Results Found</Card>
              )}
            </Box>
          </Box>
        </Box>
      )}
      {/* place member container here */}
      <ProjectMembers memberBoxVisible={memberBoxVisible} />
    </>
  );
};

export default AddMember;
