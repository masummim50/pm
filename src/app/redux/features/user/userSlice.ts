import { createSlice } from "@reduxjs/toolkit";

export type UserStateType = {
  name: string | null;
  email: string | null;
  token: string | null;
  id: string | null;
};

const initialState: UserStateType = {
  id: null,
  name: null,
  email: null,
  token: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state = action.payload;
      return state;
    },
    removeUser: (state) => {
      state.token = null;
      state.email = null;
      state.name = null;
      state.id = null;
      return state;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUser, removeUser } = userSlice.actions;

export default userSlice.reducer;
