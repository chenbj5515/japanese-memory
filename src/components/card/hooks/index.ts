import React from "react";
export * from "./use-recorder";

export function useShareCardID(cardRef: any, cardID: string) {
  React.useEffect(() => {
    cardRef.current.addEventListener("mousedown", function () {
      // 当鼠标在容器内按下时，触发这个函数
      // @ts-ignore
      window.cardID = cardID;
    //   alert("鼠标在容器内按下");
    });
  }, []);
}
