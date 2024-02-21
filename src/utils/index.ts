export * from "./time";
export * from "./speak-text";
export * from "./chat-api";
export * from "./array";
import { getRandomItemsFromArray } from "@/utils";

export const insertPlainTextAtCursor = (plainText: any) => {
  const range = window.getSelection()?.getRangeAt(0);
  range?.deleteContents();
  const textNode = document.createTextNode(plainText);
  range?.insertNode(textNode);
};


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

export function findShouldReviewDatas(data?: IMemoCard) {
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

export function findShouldReviewTranslateDatas(data?: IMemoCard) {
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
  resultList.filter(item => item.original_text.length < 50).slice(0, 20)
}
