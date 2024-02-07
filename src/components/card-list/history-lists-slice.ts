import { createSlice } from "@reduxjs/toolkit";
import { getRandomItemsFromArray } from "@/utils";

const SEVEN_MINS_AGO = 7 * 60 * 1000;
const EIGHT_HOURS_AGO = 8 * 60 * 60 * 1000;
const TWO_DAYS_AGO = 2 * 24 * 60 * 60 * 1000;
const TWO_WEEKS_AGO = 2 * 7 * 24 * 60 * 60 * 1000;
const TWO_MONTHS_AGO = 2 * 30 * 24 * 60 * 60 * 1000;

interface ICard {
  content: string;
  record_file_path: string;
  create_time: string;
  update_time: string;
  id: string;
  original_text: string;
  review_times: number;
}

interface IMemoCard {
  memo_card: ICard[];
}

function findShouldReviewDatas(data?: IMemoCard) {
  const resultList = [];
  for (const item of data?.memo_card || []) {
    const { create_time, review_times } = item;
    const timediff = new Date().getTime() - new Date(create_time).getTime();
    let needReviewTimes = 0;
    if (timediff > SEVEN_MINS_AGO) {
      needReviewTimes = 1;
    }
    if (timediff > EIGHT_HOURS_AGO) {
      needReviewTimes = 2;
    }
    if (timediff > TWO_DAYS_AGO) {
      needReviewTimes = 3;
    }
    if (timediff > TWO_WEEKS_AGO) {
      needReviewTimes = 4;
    }
    if (timediff > TWO_MONTHS_AGO) {
      needReviewTimes = 5;
    }
    if (review_times < needReviewTimes) {
      resultList.push({
        ...item,
        needReviewTimes,
      });
    }
  }
  return getRandomItemsFromArray(resultList);
}

export const historyListsSlice = createSlice({
  name: "historyLists",
  initialState: {
    historyFilterFuc: findShouldReviewDatas,
  },
  reducers: {
    changeFilterFuc: (state, action) => {
      console.log("2313")
      state.historyFilterFuc = action.payload.filterFuc
    },
  },
});

export const { changeFilterFuc } = historyListsSlice.actions;

export default historyListsSlice.reducer;
