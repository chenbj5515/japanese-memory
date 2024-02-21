import { fetchEventSource } from "@microsoft/fetch-event-source";

const apiUrl = "https://api.openai.com/v1/chat/completions";
const defaultPrompt = process.env.NEXT_PUBLIC_OPENAI_PROMPT;
const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
};
const data = {
  model: "gpt-3.5-turbo-0613",
  max_tokens: +process.env.NEXT_PUBLIC_OPENAI_API_KEY!,
  stream: true,
};

export function callChatApi(content: string, {
    onopen,
    onmessage,
    onclose,
    onerror,
    prompt
}: any) {
  fetchEventSource(apiUrl, {
    method: "POST",
    body: JSON.stringify({
      ...data,
      messages: [
        { role: "system", content: prompt || defaultPrompt },
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
