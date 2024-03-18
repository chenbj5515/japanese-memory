import React from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { useCookies } from "react-cookie";
import { Dictation, Translate } from "@/components";
import { findShouldReviewDatas } from "@/utils";
import Router from "next/router";

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

const UPDATE_TRANSLATION = gql`
  mutation UpdateMemoCard(
    $id: uuid!
    $update_time: timestamptz
    $translation: String
  ) {
    update_memo_card_by_pk(
      pk_columns: { id: $id }
      _set: { update_time: $update_time, translation: $translation }
    ) {
      id
    }
  }
`;

interface ICard {
  translation: string;
  kana_pronunciation: string;
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

export default function Translates() {
  const [cookies] = useCookies(["user_id"]);

  const { loading, data } = useQuery<IMemoCard>(GET_WORD_CARD, {
    variables: {
      user_id: cookies.user_id,
    },
    fetchPolicy: "no-cache",
  });

  React.useEffect(() => {
    if (!cookies.user_id) {
      Router.push("/");
    }
  }, []);

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

  return findShouldReviewDatas(data?.memo_card || [], "translation")?.map(
    (item, index) => <Translate item={item} key={index} />
  );
}
