import { useEffect, useRef, useState } from "react";
import { Button, TextField } from "@mui/material";

import { useCreateTodoMutation } from "../../redux/features/todo/todo.api";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";

import { lightBlue, deepOrange, red } from "@mui/material/colors";
import { LoadingButton } from "@mui/lab";
import { getCurrentTimeString } from "../../lib/dateFunctions";

const TodoForm = () => {
  const priorities = [
    {
      value: "1",
      label: "Low",
      color: lightBlue[400],
    },
    {
      value: "2",
      label: "Medium",
      color: deepOrange[400],
    },
    {
      value: "3",
      label: "High",
      color: red[400],
    },
  ];
  const [addTodo, { isLoading: addingTodo }] = useCreateTodoMutation();

  const inputRef = useRef<HTMLInputElement>(null);
  const [priority, setPriority] = useState(2);

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputRef]);

  const [buttonDisabled, setButtonDisabled] = useState(true);
  const handleAddTodo = () => {
    if (inputRef.current && inputRef.current.value) {
      const todo = { title: inputRef.current?.value, priority };
      addTodo(todo);
      if (inputRef && inputRef.current) {
        inputRef.current.value = "";
        setButtonDisabled(true);
      }
    }
  };

  const addRandomTodo = () => {
    const value =`Todo -- ${getCurrentTimeString()}`;
    setPriority(Math.floor(Math.random() * 3) + 1);
    if (inputRef.current) {
      inputRef.current.value = value;
      setButtonDisabled(false)
    }
  };

  return (
    // <ThemeProvider theme={}>
      <Box sx={{ marginBottom: "5px" }}>
        <TextField
          // sx={whiteInput}
          label="Todo"
          placeholder="Add todo item"
          size="small"
          onChange={(e) => setButtonDisabled(e.target.value == "")}
          onKeyDown={(e) => e.key === "Enter" && handleAddTodo()}
          inputRef={inputRef}
          InputLabelProps={{shrink:true}}
        />
        <TextField
          onChange={(e) => setPriority(parseInt(e.target.value))}
          sx={{
            marginRight: 1,
            // ...formColor(priorities[priority-1].color),

            color: priorities[priority - 1].color,
            input: { color: priorities[priority - 1].color },
            label: {
              color: priorities[priority - 1].color,
            },
            outline: {
              color: priorities[priority - 1].color,
            },
            borderRadius: "5px",
            "& .Mui-focused": {
              color: priorities[priority - 1].color,
            },
            "& .MuiOutlinedInput-root": {
              color: priorities[priority - 1].color,
              "&.Mui-focused fieldset": {
                borderColor: priorities[priority - 1].color,
              },
            },
            borderColor: priorities[priority - 1].color,
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: priorities[priority - 1].color,
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: priorities[priority - 1].color,
              outline: {
                color: priorities[priority - 1].color,
              },
            },
          }}
          size="small"
          select
          label="Priority"
          // defaultValue={priorities[1].value}
          value={priority}
        >
          {priorities.map((priority) => (
            <MenuItem key={priority.label} value={priority.value}>
              {priority.label}
            </MenuItem>
          ))}
        </TextField>
        <LoadingButton
          
          disabled={buttonDisabled}
          loading={addingTodo}
          variant="contained"
          size="medium"
          onClick={handleAddTodo}
        >
          Add Todo
        </LoadingButton>
        {/* <HoverRating value={priority} setValue={setPriority}/> */}
        {/* <input ref={inputRef}></input> */}
        <Button
          onClick={addRandomTodo}
          size="medium"
          variant="contained"
          color="secondary"
        >
          Random
        </Button>
      </Box>
    // </ThemeProvider>
  );
};

export default TodoForm;
