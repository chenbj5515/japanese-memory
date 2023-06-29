import { useRef, useReducer } from "react";
import { useDispatch } from "react-redux";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import {
  showCard,
  addText,
  updateState,
} from "@/components/card/card-data-slice";
import { insertPlainTextAtCursor } from "@/utils";
import { useForceUpdate } from "@/hooks";
import { allowSendStatereducer } from "./reducers";

const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
const apiUrl = "https://api.openai.com/v1/chat/completions";
const prompt =
  "对给出的日文文本，给出翻译、假名表示的读音和语法分析。注意，语法分析的时候，被分析的原文也需要给出读音。";
const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${apiKey}`,
};
const data = {
  model: "gpt-3.5-turbo-0301",
  max_tokens: 1000,
  stream: true,
};

export function InputBox() {
  const editableRef = useRef<any>();

  const [{ allowSendFlg }, dispath] = useReducer(allowSendStatereducer, {
    allowSendFlg: false,
  });

  const forUpdate = useForceUpdate();
  const dispatch = useDispatch();

  function handleSendBtnClick() {
    const content = editableRef.current.textContent;
    fetchEventSource(apiUrl, {
      method: "POST",
      body: JSON.stringify({
        ...data,
        messages: [
          { role: "system", content: prompt },
          { role: "user", content },
        ],
      }),
      headers,
      openWhenHidden: true,
      async onopen(res) {
        dispatch(
          showCard({
            text: `原文：${content}\n\n`,
            originalText: content,
          })
        );
      },
      onmessage(event) {
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
        dispatch(
          addText({
            text: curText,
          })
        );
      },
      async onclose() {
        dispatch(updateState("ended"));
      },
      onerror(err) {},
    });
    if (editableRef.current) {
      editableRef.current.textContent = "";
      forUpdate();
    }
  }

  const handlePaste = (event: any) => {
    event.preventDefault();
    const plainText = event.clipboardData.getData("text/plain");
    insertPlainTextAtCursor(plainText);
    forUpdate();
  };

  function handleInput() {
    dispath({ type: "input" });
  }

  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (allowSendFlg) {
        handleSendBtnClick();
      } else {
        dispath({ type: "enterKeyDown" });
      }
    }
  };

  return (
    <div>
      <div
        ref={editableRef}
        onInput={handleInput}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
        className="input absolute bg-[#e8e8e8] left-[50%] bottom-0 transhtmlForm -translate-x-1/2"
        contentEditable
      />
      <div
        className={`w-[32px] h-[32px] ${
          editableRef.current?.textContent ? "bg-[#d329d3] hover:bg-dark" : ""
        } rounded-[0.375rem] absolute top-[50%] -translate-y-1/2 right-4`}
        onClick={handleSendBtnClick}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="none"
          className="h-4 w-4 m-1 md:m-0 absolute left-[50%] top-[50%] -translate-x-1/2 -translate-y-1/2 right-4 cursor-pointer"
          strokeWidth="2"
        >
          <path
            d="M.5 1.163A1 1 0 0 1 1.97.28l12.868 6.837a1 1 0 0 1 0 1.766L1.969 15.72A1 1 0 0 1 .5 14.836V10.33a1 1 0 0 1 .816-.983L8.5 8 1.316 6.653A1 1 0 0 1 .5 5.67V1.163Z"
            fill={editableRef.current?.textContent ? "white" : "grey"}
          ></path>
        </svg>
      </div>
    </div>
  );
}
