import { useRef, useReducer } from "react";
import { useDispatch } from "react-redux";
import { addCard } from "../card-list/loacl-cards-slice";
import { insertPlainTextAtCursor } from "@/utils";
import { useForceUpdate } from "@/hooks";
import { allowSendStatereducer } from "./reducers";

export function InputBox() {
  const editableRef = useRef<any>();

  const [{ allowSendFlg }, dispath] = useReducer(allowSendStatereducer, {
    allowSendFlg: false,
  });

  const forUpdate = useForceUpdate();
  const dispatch = useDispatch();

  function handleSendBtnClick() {
    const content = editableRef.current.textContent;
    dispatch(
      addCard({
        originalText: content,
      })
    );

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
    const content = editableRef.current.textContent;

    if (event.key === "Enter" && content) {
      event.preventDefault();
      if (allowSendFlg) {
        handleSendBtnClick();
      } else {
        dispath({ type: "enterKeyDown" });
      }
    }
  };

  return (
    <>
      <div
        ref={editableRef}
        onInput={handleInput}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
        className="dark:bg-bgDark dark:text-white dark:border-[1px] absolute input bg-[#fff] left-[50%] bottom-0 transhtmlForm -translate-x-1/2"
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
          className="h-4 w-4 absolute left-[50%] top-[50%] -translate-x-[42%] -translate-y-1/2 cursor-pointer"
          strokeWidth="2"
        >
          <path
            d="M.5 1.163A1 1 0 0 1 1.97.28l12.868 6.837a1 1 0 0 1 0 1.766L1.969 15.72A1 1 0 0 1 .5 14.836V10.33a1 1 0 0 1 .816-.983L8.5 8 1.316 6.653A1 1 0 0 1 .5 5.67V1.163Z"
            fill={editableRef.current?.textContent ? "white" : "grey"}
          ></path>
        </svg>
      </div>
    </>
  );
}
