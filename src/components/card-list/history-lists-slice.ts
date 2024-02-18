import { createSlice } from "@reduxjs/toolkit";

export const historyListsSlice = createSlice({
  name: "historyLists",
  initialState: {
    historyLists: [],
  },
  reducers: {
    updateHistoryLists: (state, action) => {
      state.historyLists = action.payload.historyLists;
    },
  },
});

export const { updateHistoryLists } = historyListsSlice.actions;

export default historyListsSlice.reducer;
