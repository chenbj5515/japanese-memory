import React from "react";
import { gql, useQuery } from "@apollo/client";
import { useSelector } from "react-redux";
import { useCookies } from "react-cookie";
import { getRandomItemsFromArray } from "@/utils";
import { CardInHistory, CardInHome } from "../card";

const GET_CARD = gql`
  query GetMemoCard($user_id: String!) {
    memo_card(
      where: { user_id: { _eq: $user_id } }
    ) {
      user_id
      content
      original_text
      record_file_path
      create_time
      update_time
      id
      review_times
    }
  }
`;

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

interface IProps {
  type: "history" | "local";
}

const SEVEN_MINS_AGO = 7 * 60 * 1000;
const EIGHT_HOURS_AGO = 8 * 60 * 60 * 1000;
const TWO_DAYS_AGO = 2 * 24 * 60 * 60 * 1000;
const TWO_WEEKS_AGO = 2 * 7 * 24 * 60 * 60 * 1000;
const TWO_MONTHS_AGO = 2 * 30 * 24 * 60 * 60 * 1000;

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
  return getRandomItemsFromArray(resultList, 20);
}

export function CardList(props: IProps) {
  const [cookies] = useCookies(["user_id"]);

  const { loading, data } = useQuery<IMemoCard>(GET_CARD, {
    variables: {
      user_id: cookies.user_id
    }
  });
  const { type } = props;
  const shouldReviewDatas = findShouldReviewDatas(data);
  const { localCards } = useSelector((state: any) => state.localCardsSlice);

  if (type === "history" && loading) {
    return (
      <div className="pyramid-loader">
        <div className="wrapper">
          <span className="side side1"></span>
          <span className="side side2"></span>
          <span className="side side3"></span>
          <span className="side side4"></span>
          <span className="shadow"></span>
        </div>
      </div>
    );
  }

  if (type === "history") {
    return (
      <>
        {shouldReviewDatas.map(
          ({ content, original_text, record_file_path, create_time, id }) => (
            <CardInHistory
              key={id}
              text={content}
              originalText={original_text}
              recorderPath={record_file_path}
              createTime={create_time}
              cardID={id}
            />
          )
        )}
      </>
    );
  }

  return (
    <>
      {localCards?.map(({ originalText, id }: any) => (
        <CardInHome key={id} originalText={originalText} />
      ))}
    </>
  );
}
