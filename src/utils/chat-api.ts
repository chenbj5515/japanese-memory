import { fetchEventSource } from "@microsoft/fetch-event-source";

const apiUrl = "https://api.openai.com/v1/chat/completions";
const prompt =
  "对给出的日文文本，给出翻译、假名表示的读音和语法分析。注意，语法分析的时候，日文部分也需要给出读音。";
const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
};
const data = {
  model: "gpt-3.5-turbo-0301",
  max_tokens: 1000,
  stream: true,
};

interface IOption {
    onopen: voidFunc,
    onmessage: voidFunc,
    onclose: voidFunc,
    onerror: voidFunc,
}

type voidFunc = () => void

export function callChatApi(content: string, {
    onopen,
    onmessage,
    onclose,
    onerror
}: any) {
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
    onopen,
    onmessage,
    onclose,
    onerror,
  });
}
