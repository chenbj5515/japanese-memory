import React from "react";
import { useCookies } from "react-cookie";
import { getTimeAgo, speakText, callChatApi } from "@/utils";
import { gql, useMutation } from "@apollo/client";
import { useRefState, useForceUpdate } from "@/hooks";

const INSERT_WORD_CARD = gql`
  mutation InsertWordCard(
    $word: String
    $meaning: String
    $create_time: timestamptz
    $user_id: String
    $memo_card_id: uuid!
  ) {
    insert_word_card(
      objects: {
        word: $word
        meaning: $meaning
        create_time: $create_time
        user_id: $user_id
        memo_card_id: $memo_card_id
      }
    ) {
      affected_rows
      returning {
        id
        word
        meaning
        create_time
        memo_card_id
        user_id
      }
    }
  }
`;

export function WordCardAdder() {
  const [selectedText, setSelectedText] = useRefState("");
  const [{ left, top }, setPosition] = React.useState({
    left: 0,
    top: 0,
  });
  const forceUpdate = useForceUpdate();
  const meaningTextRef = React.useRef<any>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [insertWordCard] = useMutation(INSERT_WORD_CARD);
  const [cookies] = useCookies(["user_id"]);

  function handleSelectEvent() {
    const selection = document.getSelection();
    if (selection && selection.rangeCount > 0) {
      const selectedText = selection.toString().trim();
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      if (selectedText.length) {
        setSelectedText(selectedText);
        setPosition({
          left: rect.right,
          top: rect.bottom,
        });
      }
    }
  }

  function handleCloseContainer(event: any) {
    const inContainer = event.target === containerRef.current ||
    containerRef.current?.contains(event.target as any);
    if (selectedText.current && inContainer === false) {
      setSelectedText("");
    }
  }

  React.useEffect(() => {
    document.addEventListener("mouseup", (event) => {
      handleSelectEvent();
      handleCloseContainer(event);
    });
  }, []);

  React.useEffect(() => {
    if (meaningTextRef.current) {
      meaningTextRef.current.textContent = "意味：";
    }
    if (selectedText.current.length) {
      callChatApi(selectedText.current, {
        onmessage(event: any) {
          if (event.data === "[DONE]") {
            return;
          }
          const parsedData = JSON.parse(event.data);
          const curText = parsedData.choices
            .map((choice: any) => {
              if (choice.delta) {
                return choice.delta.content;
              }
              return "";
            })
            .join("");
          if (meaningTextRef.current) {
            meaningTextRef.current.textContent += curText;
          }
        },
        async onclose() {
          if (meaningTextRef.current) {
            forceUpdate();
          }
        },
        onerror() {},
        prompt:
          "我会给你输入一个日文单词或者短语，请给出它的中文翻译结果。格式要求是仅输出翻译结果",
      });
    }
  }, [selectedText.current]);

  function handleAddWord() {
    insertWordCard({
      variables: {
        word: selectedText.current,
        meaning: meaningTextRef.current.textContent,
        create_time: new Date(),
        user_id: cookies.user_id,
        // @ts-ignore
        memo_card_id: window.cardID,
      },
    });
    setSelectedText("");
  }

  return selectedText.current ? (
    <div
      ref={containerRef}
      className="card max-w-[240px] z-[15] rounded-[6px] text-[15px] dark:bg-eleDark dark:text-white dark:shadow-dark-shadow p-3 mx-auto fixed"
      style={{ top, left }}
    >
      <div>单词・短语：{selectedText.current}</div>
      <div
        contentEditable
        ref={meaningTextRef}
        className="whitespace-pre-wrap outline-none"
      ></div>
      <div className="flex justify-center mt-2">
        {" "}
        <button
          className="bg-white text-black rounded-[10px] text-sm font-semibold py-2 px-4 cursor-pointer transition-all ease-in-out duration-300 border border-black shadow-none hover:-translate-y-1 hover:-translate-x-1 hover:shadow-[1px_3px_0_0_black] active:translate-y-1 active:translate-x-0.5 active:shadow-none"
          onClick={handleAddWord}
        >
          加入到单词本
        </button>
      </div>{" "}
    </div>
  ) : null;
}
