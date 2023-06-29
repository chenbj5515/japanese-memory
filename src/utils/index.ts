export * from "./time";

export const insertPlainTextAtCursor = (plainText: any) => {
  const range = window.getSelection()?.getRangeAt(0);
  range?.deleteContents();
  const textNode = document.createTextNode(plainText);
  range?.insertNode(textNode);
};
