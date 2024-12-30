import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export const getGroqResponse = async (chatMessages: ChatMessage[]) => {
  const messages: ChatMessage[] = [
    {
      role: "system",
      content:
        "You are an academic expert, you always cite your sources and base you reponses only on the context that you have been provided.",
    },
    ...chatMessages,
  ];
  console.log("Groq API requested");

  const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: messages,
  });

  console.log("Groq API done", response);
  return response.choices[0].message.content;
};
