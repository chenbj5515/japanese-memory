import { createSlice } from "@reduxjs/toolkit";
export const cardDataSlice = createSlice({
  name: "cardData",
  initialState: {
    state: "hidden",
    text: "",
    originalText: "",
    cardID: "",
  },
  reducers: {
    // AI的结果流返回开始前，需要先把原文存储上。
    showCard: (state, action) => {
      const { text, originalText } = action.payload;
      state.state = "display";
      state.text += text;
      state.originalText = originalText;
    },
    // 从AI的API获取到数据流后不断地更新text，让card内的文本内容展示出来
    addText: (state, action) => {
      const { text } = action.payload;
      state.state = "display";
      state.text += text;
    },
    // 当从AI获取到所有结果后，需要把结果插入到标中存储起来
    updateCardId: (state, action) => {
      const { cardID } = action.payload;
      state.cardID = cardID;
    },
    // 当AI的结果全部返回完毕后，需要把状态置为ended。
    updateState: (state, action) => {
      state.state = action.payload;
      if (action.payload === "inserted") {
        state.text = "";
        state.originalText = "";
        state.cardID = "";
      }
    },
  },
});

export const { addText, updateCardId, updateState, showCard } = cardDataSlice.actions;

export default cardDataSlice.reducer;
