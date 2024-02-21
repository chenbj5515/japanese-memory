import React from "react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { useSelector, useDispatch } from "react-redux";
import { updateHistoryLists } from "../card-list/history-lists-slice";
import { useCookies } from "react-cookie";
import { findShouldReviewDatas, callChatApi } from "@/utils";
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

const UPDATE_TRANSLATION_AND_KANA = gql`
  mutation UpdateMemoCard(
    $id: uuid!
    $translation: String
    $kana_pronunciation: String
  ) {
    update_memo_card_by_pk(
      pk_columns: { id: $id }
      _set: {
        translation: $translation
        kana_pronunciation: $kana_pronunciation
      }
    ) {
      id
      translation
      kana_pronunciation
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

  const [update] = useMutation(UPDATE_TRANSLATION_AND_KANA);

  function promisefy(original_text: string, prompt: string) {
    let tanslation = "";
    return new Promise((resolve, reject) => {
      console.log("call=====");
      callChatApi(original_text, {
        onmessage(event: any) {
          if (event.data === "[DONE]") {
            return;
          }
          const parsedData = JSON.parse(event.data);
          const curText =
            parsedData.choices
              ?.map((choice: any) => {
                if (choice.delta) {
                  return choice.delta.content;
                }
                return "";
              })
              ?.join("") || "";
          tanslation += curText;
        },
        async onclose() {
          resolve(tanslation);
        },
        onerror(err: any) {
          console.log(err, "err====");
        },
        prompt,
      });
    });
  }

  // async function handleClick() {
  //   if (data) {
  //     for (let { id, original_text } of data.memo_card) {
  //       try {
  //         const p1 = promisefy(original_text, "对我给出的日文，给出中文翻译");
  //         const p2 = promisefy(
  //           original_text,
  //           "对我给出的日文，给出假名形式的读音标记"
  //         );
  //         const res = await Promise.all([p1, p2]);
  //         await update({
  //           variables: {
  //             id,
  //             translation: res[0],
  //             kana_pronunciation: res[1],
  //           },
  //         });
  //         console.log(res, "res======");
  //         // 在这里处理 res
  //       } catch (error) {
  //         console.error("处理 memo card 时出错：", error);
  //         // 根据需要处理错误
  //       }
  //     }
  //   }
  // }

  // console.log(data, "data====");

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
      {localCards?.map(({ original_text, id }: any) => (
        <CardInHome key={id} originalText={original_text} />
      ))}
    </>
  );
}
