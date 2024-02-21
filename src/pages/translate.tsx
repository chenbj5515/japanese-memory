import React from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { useCookies } from "react-cookie";
import { getTimeAgo, speakText, callChatApi } from "@/utils";
import { findShouldReviewTranslateDatas } from "@/utils";

const GET_WORD_CARD = gql`
  query GetMemoCard($user_id: String!) {
    memo_card(
      where: { user_id: { _eq: $user_id }, review_times: { _neq: 0 } }
      order_by: { create_time: desc }
      limit: 100
    ) {
      id
      translation
      kana_pronunciation
      create_time
      original_text
      review_times
      user_id
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

export default function Translate() {
  const [cookies] = useCookies(["user_id"]);

  const { loading, data, refetch } = useQuery<IMemoCard>(GET_WORD_CARD, {
    variables: {
      user_id: cookies.user_id,
    },
    fetchPolicy: "no-cache",
  });

  if (loading) {
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

  console.log(data && findShouldReviewTranslateDatas(data), "data===")
  return (
    data?.memo_card?.map(item => (
        <div className="card rounded-[20px] dark:bg-eleDark dark:text-white dark:shadow-dark-shadow p-5 width-92-675 mx-auto mt-10 relative">
            {/* {item.}     */}
        </div>
    ))
  );
}
