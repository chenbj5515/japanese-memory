import { createSlice } from "@reduxjs/toolkit";

export interface ILoaclCard {
    id: number;
    // state: string,
    // text: string,
    originalText: string,
}

export const localCardsSlice = createSlice({
  name: "localCards",
  initialState: {
    localCards: [] as ILoaclCard[],
  },
  reducers: {
    // AI的结果流返回开始前，需要先把原文存储上。
    addCard: (state, action) => {
      state.localCards.push({
          id: new Date().getTime(),
          originalText: action.payload.originalText
      })
    },
  },
});

export const { addCard } = localCardsSlice.actions;

export default localCardsSlice.reducer;
