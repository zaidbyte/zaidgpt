"use client";
import { useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isDark, setIsDark] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMessage: Message = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      setMessages([
        ...newMessages,
        { role: "assistant", content: data.reply || "No response." },
      ]);
    } catch (err) {
      console.error(err);
    }
  };

  // ---------- PANIC SCRIPT ----------
  const launchab = () => {
    const tab = window.open("about:blank", "_blank");
    if (!tab) return; // popup blocked failsafe

    const iframe = tab.document.createElement("iframe");
    const stl = iframe.style;
    stl.border = stl.outline = "none";
    stl.width = "100vw";
    stl.height = "100vh";
    stl.position = "fixed";
    stl.left = stl.right = stl.top = stl.bottom = "0";

    iframe.src = self.location as any;
    tab.document.body.appendChild(iframe);

    window.parent.window.location.replace(
      localStorage.getItem("panicurl") || "https://classroom.google.com/h"
    );
  };
  // ----------------------------------

  return (
    <div className={`min-h-screen ${isDark ? "bg-gray-900" : "bg-white"} transition-colors duration-300`}>
      {/* Header */}
      <div className={`${isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} border-b-2 px-8 py-6 flex items-center justify-between`}>
        <div className="flex items-center gap-6">
          <h1 className={`text-4xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
            Z-GPT
          </h1>

          <div className="flex gap-3">
            {/* 🚨 Panic Button */}
            <button
              onClick={launchab}
              className={`${isDark ? "bg-red-700 hover:bg-red-600 text-white" : "bg-red-100 hover:bg-red-200 text-red-900"} px-6 py-2 rounded-lg font-medium transition-colors`}
            >
              Launch in About:blank
            </button>
          </div>
        </div>

        {/* Settings Button */}
        <button
          onClick={() => setIsDark(!isDark)}
          className={`${isDark ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-900"} px-5 py-2 rounded-lg font-medium transition-colors flex items-center gap-2`}
        >
          {isDark ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto p-6 h-[calc(100vh-120px)] flex flex-col">
        {/* Messages Area */}
        <div className={`flex-1 ${isDark ? "bg-gray-800" : "bg-gray-50"} rounded-2xl p-8 mb-6 overflow-y-auto shadow-lg`}>
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-4">
                <div className="text-6xl">💬</div>
                <p className={`${isDark ? "text-gray-400" : "text-gray-600"} text-2xl font-medium`}>
                  Start a conversation with Z-GPT
                </p>
                <p className={`${isDark ? "text-gray-500" : "text-gray-500"} text-lg`}>
                  Ask me anything and I'll help you out!
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[75%] rounded-2xl px-6 py-4 shadow-md ${
                      m.role === "user"
                        ? isDark
                          ? "bg-gray-700 text-white"
                          : "bg-gray-200 text-gray-900"
                        : isDark
                        ? "bg-gray-900 text-white border-2 border-gray-700"
                        : "bg-white text-gray-900 border-2 border-gray-300"
                    }`}
                  >
                    <div className={`text-xs font-bold mb-2 uppercase tracking-wider ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                      {m.role === "user" ? "You" : "Z-GPT"}
                    </div>
                    <div className="text-lg leading-relaxed whitespace-pre-wrap break-words">
                      {m.content}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className={`${isDark ? "bg-gray-800" : "bg-gray-50"} rounded-2xl p-6 shadow-lg`}>
          <div className="flex gap-4 items-center">
            <input
              className={`flex-1 ${isDark ? "bg-gray-700 text-white border-gray-600" : "bg-white text-gray-900 border-gray-300"} text-lg rounded-xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-gray-500 border-2 placeholder-gray-400 transition-all`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message here..."
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) handleSubmit(e);
              }}
            />
            <button
              className={`${isDark ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-900"} font-bold text-lg rounded-xl px-10 py-4 shadow-md transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
              type="submit"
              onClick={handleSubmit}
              disabled={!input.trim()}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
