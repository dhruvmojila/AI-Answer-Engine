// TODO: Implement the chat API with Groq and web scraping with Cheerio and Puppeteer
// Refer to the Next.js Docs on how to read the Request body: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
// Refer to the Groq SDK here on how to use an LLM: https://www.npmjs.com/package/groq-sdk
// Refer to the Cheerio docs here on how to parse HTML: https://cheerio.js.org/docs/basics/loading
// Refer to Puppeteer docs here: https://pptr.dev/guides/what-is-puppeteer

import { getGroqResponse } from "@/app/utils/groqClient";
import { scrapeUrl, urlPattern } from "@/app/utils/scraper";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message, messages } = await req.json();

    console.log("Msg received: ", message);

    let scrappedContent = "";

    const url = message.match(urlPattern);
    if (url) {
      console.log("url found", url);

      const scrappedResponse = await scrapeUrl(url[0]);
      scrappedContent = scrappedResponse.content;
      console.log("scrapped contetn", scrappedContent);
    }

    const userQuery = message.replace(url ? url[0] : "", "").trim();

    const userPrompt = `
    Answer my questions: "${userQuery}"

    Based on the following content: 
    <content>
    ${scrappedContent}
    </content>
    `;

    let llmMessages = [
      ...messages,
      {
        role: "user",
        content: userPrompt,
      },
    ];

    const response = await getGroqResponse(llmMessages);

    return NextResponse.json({ message: response });
  } catch (error) {
    return NextResponse.json({ message: "Error" });
  }
}
