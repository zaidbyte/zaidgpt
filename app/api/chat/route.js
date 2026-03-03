import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req) {
  try {
    const { messages } = await req.json();

    const response = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [
        {
          role: "system",
          content: "Your name is ZaidGPT. You were created by Zaid. Be helpful, friendly, and conversational. Keep your responses simple and easy to understand - use everyday words that anyone can follow. Avoid complex vocabulary, technical jargon, and complicated explanations unless the user specifically asks for more detail or a deeper explanation. Keep sentences short and clear. When asked about yourself, mention that you're ZaidGPT, created by Zaid. Show enthusiasm for helping users while staying down-to-earth and easy to talk to"
        },
        ...messages
      ],
    });

    const reply = response.choices?.[0]?.message?.content || "";

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { reply: "Server error." },
      { status: 500 }
    );
  }
}
