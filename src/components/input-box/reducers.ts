type IState = {
  allowSendFlg: boolean;
};

type AllowSendStateAction = { type: "input" } | { type: "enterKeyDown" };

export function allowSendStatereducer(state: IState, action: AllowSendStateAction) {
  switch (action.type) {
    case "input":
      return { ...state, allowSendFlg: false };
    case "enterKeyDown":
      return { ...state, allowSendFlg: true };
    default:
      return { allowSendFlg: true };
  }
}


