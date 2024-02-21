import React from "react";
import { gql, useQuery } from "@apollo/client";
import { useSelector, useDispatch } from "react-redux";
import { updateHistoryLists } from "../card-list/history-lists-slice";
import { useCookies } from "react-cookie";
import { findShouldReviewDatas } from "@/utils";
import { CardInHistory, CardInHome } from "../card";

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

const GET_CARD = gql`
  query GetMemoCard($user_id: String!) {
    memo_card(where: { user_id: { _eq: $user_id } }) {
      user_id
      translation
      kana_pronunciation
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

export function CardList(props: IProps) {
  const [cookies] = useCookies(["user_id"]);
  const dispatch = useDispatch();

  const { loading, data } = useQuery<IMemoCard>(GET_CARD, {
    variables: {
      user_id: cookies.user_id,
    },
  });

  const { historyLists } = useSelector((state: any) => state.historyListsSlice);

  React.useEffect(() => {
    if (!historyLists.length && data) {
      dispatch(
        updateHistoryLists({
          historyLists: findShouldReviewDatas(data),
        })
      );
    }
  }, [data, historyLists]);

  const { localCards } = useSelector((state: any) => state.localCardsSlice);

  const { type } = props;

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
        {historyLists.map(
          ({
            translation,
            kana_pronunciation,
            original_text,
            record_file_path,
            create_time,
            id,
          }: any) => (
            <CardInHistory
              key={id}
              translation={translation}
              kanaPronunciation={kana_pronunciation}
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
