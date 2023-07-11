import React from "react";
import { gql, useQuery } from "@apollo/client";
import { useSelector } from "react-redux";
import { CardInHistory, CardInHome } from "../card";

const GET_CARD = gql`
  query GetMemoCard {
    memo_card(order_by: { create_time: asc }) {
      content
      original_text
      record_file_path
      create_time
      update_time
      id
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
}

interface IMemoCard {
  memo_card: ICard[];
}

interface IProps {
  type: "history" | "local"
}

export function CardList(props: IProps) {
  const { loading, data } = useQuery<IMemoCard>(GET_CARD);
  const {type} = props;

  const { localCards } = useSelector(
    (state: any) => state.localCardsSlice
  );

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
        {data?.memo_card?.map(({ content, original_text, record_file_path, create_time, id }) => (
          <CardInHistory
            key={id}
            text={content}
            originalText={original_text}
            recorderPath={record_file_path}
            createTime={create_time}
            cardID={id}
          />
        ))}
      </>
    );
  }

  return (
    <>
        {localCards?.map(({originalText, id}: any) => (
          <CardInHome key={id} originalText={originalText} />
        ))}
      </>
  )
}
