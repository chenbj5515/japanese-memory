import React from "react";
import { gql, useQuery } from "@apollo/client";
import { useSelector } from "react-redux";
import { useCookies } from "react-cookie";
import { CardInHistory, CardInHome } from "../card";

const GET_CARD = gql`
  query GetMemoCard($user_id: String!) {
    memo_card(where: { user_id: { _eq: $user_id } }) {
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

export function CardList(props: IProps) {
  const [cookies] = useCookies(["user_id"]);

  const { loading, data } = useQuery<IMemoCard>(GET_CARD, {
    variables: {
      user_id: cookies.user_id,
    },
  });

  const { historyFilterFuc } = useSelector(
    (state: any) => state.historyListsSlice
  );
  const { localCards } = useSelector((state: any) => state.localCardsSlice);

  // const [handleDataFuc, setHandleDataFuc] = React.useState(() => findShouldReviewDatas);

  const { type } = props;
  const shouldReviewDatas = historyFilterFuc(data);

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
          ({
            content,
            original_text,
            record_file_path,
            create_time,
            id,
          }: any) => (
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
