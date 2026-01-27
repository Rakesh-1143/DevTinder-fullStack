import { createSlice } from "@reduxjs/toolkit";


const userSlice = createSlice({
  name: "user",
  initialState: null,
  reducers: {
    addItem: (state, action) => {
      return action.payload;
    },
    removeItem: (state, action) => {
      return null;
    },
  },
});

export const { addItem, removeItem } = userSlice.actions;
export default userSlice.reducer;
