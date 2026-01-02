import { createSlice } from "@reduxjs/toolkit";



export interface FilterState {
  filter: boolean;
  taskType:string
}

const initialState: FilterState = {
  filter: false,
  taskType: ""
};

export const projectSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setFilter: (state) => {
      state.filter = !state.filter
    },
    changeType: (state, action)=> {
        state.taskType = action.payload;
    }
  },
});

// Action creators are generated for each case reducer function
export const { setFilter, changeType } = projectSlice.actions;

export default projectSlice.reducer;
