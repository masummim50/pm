import { createSlice } from "@reduxjs/toolkit";


export interface TodoState {
  value: boolean;
}

const initialState: TodoState = {
  value: true,
};

export const todoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {
    change: (state) => {
      state.value = !state.value;
    },
    
  },
});

// Action creators are generated for each case reducer function
export const { change} = todoSlice.actions;

export default todoSlice.reducer;
