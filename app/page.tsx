"use client";

import { useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>(
    []
  );
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    setLoading(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });

    const data = await res.json();

    const botMessage = { sender: "assistant", text: data.reply };
    setMessages((prev) => [...prev, botMessage]);

    setLoading(false);
    setInput("");
  }

  return (
    <main className="flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-6">ZaidGPT</h1>

      <div className="w-full max-w-xl bg-gray-900 text-white p-4 rounded-lg h-[500px] overflow-y-auto mb-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`mb-2 ${
              msg.sender === "user" ? "text-blue-400" : "text-green-400"
            }`}
          >
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}

        {loading && <p className="text-yellow-400">Thinking...</p>}
      </div>

      <div className="max-w-xl w-full flex gap-2">
        <input
          className="flex-1 p-2 rounded bg-gray-800 text-white"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask something..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 px-4 py-2 rounded text-white"
        >
          Send
        </button>
      </div>
    </main>
  );
}
