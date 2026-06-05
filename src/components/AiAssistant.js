/* ============================================
   AI YORDAMCHI WIDGET (AiAssistant.js)
   ============================================
   Sahifaning o'ng-pastki burchagida turuvchi
   suzuvchi (floating) chat tugmasi. Bosilganda
   suhbat oynasi ochiladi va foydalanuvchi AI
   yordamchi bilan yozishadi.

   Vercel AI SDK (v6) — useChat hook ishlatiladi.
   Javoblar oqim (streaming) shaklida ko'rsatiladi.
   ============================================ */

"use client";

import { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Bot, X, Send, Loader2, Sparkles, MessageCircle } from "lucide-react";

// Foydalanuvchiga taklif qilinadigan tezkor savollar
const SUGGESTIONS = [
  "Prompt-engineering nima?",
  "ChatGPT'dan ta'limda qanday foydalanaman?",
  "Saytda qanday resurslar bor?",
];

export default function AiAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const isLoading = status === "submitted" || status === "streaming";

  // Yangi xabar kelganda pastga aylantirish
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Xabar yuborish
  const handleSubmit = (e) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;
    sendMessage({ text });
    setInput("");
  };

  // Tezkor savolni yuborish
  const sendSuggestion = (text) => {
    if (isLoading) return;
    sendMessage({ text });
  };

  // Xabar matnini parts'dan yig'ish
  const getText = (message) =>
    (message.parts || [])
      .filter((p) => p.type === "text")
      .map((p) => p.text)
      .join("");

  return (
    <>
      {/* ============================================
          SUZUVCHI TUGMA
          ============================================ */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-[60] inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white pl-4 pr-5 py-3.5 rounded-full shadow-xl shadow-primary/30 transition-all duration-300 hover:scale-105 cursor-pointer group"
          aria-label="AI yordamchini ochish"
        >
          <span className="relative flex">
            <Bot className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-primary animate-pulse" />
          </span>
          <span className="text-sm font-semibold hidden sm:inline">
            AI Yordamchi
          </span>
        </button>
      )}

      {/* ============================================
          SUHBAT OYNASI
          ============================================ */}
      {open && (
        <div className="fixed bottom-5 right-5 z-[60] w-[calc(100vw-2.5rem)] sm:w-96 h-[70vh] sm:h-[550px] max-h-[600px] bg-white rounded-3xl shadow-2xl border border-border/60 flex flex-col overflow-hidden animate-fade-in-up">
          {/* Sarlavha */}
          <div className="flex items-center justify-between gap-3 px-5 py-4 bg-gradient-to-r from-primary to-primary-dark text-white shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-sm leading-tight">AI Yordamchi</h3>
                <p className="text-[11px] text-white/80 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                  Coda Academy • doim onlayn
                </p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-xl hover:bg-white/20 transition-colors cursor-pointer"
              aria-label="Yopish"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Xabarlar */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-cream-dark/10"
          >
            {/* Boshlang'ich xush kelibsiz */}
            {messages.length === 0 && (
              <div className="text-center py-6">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary mb-3">
                  <Sparkles className="w-7 h-7" />
                </div>
                <h4 className="font-bold text-foreground text-sm">
                  Salom! Men AI yordamchingizman 👋
                </h4>
                <p className="text-xs text-muted mt-1.5 max-w-[260px] mx-auto leading-relaxed">
                  Sun'iy intellekt, promptlar yoki platforma bo'yicha
                  savolingiz bo'lsa, bemalol so'rang.
                </p>
                <div className="mt-4 space-y-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => sendSuggestion(s)}
                      className="block w-full text-left text-xs bg-white border border-border/60 hover:border-primary/40 hover:bg-primary/5 text-foreground rounded-2xl px-3.5 py-2.5 transition-all cursor-pointer"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Suhbat xabarlari */}
            {messages.map((message) => {
              const isUser = message.role === "user";
              const text = getText(message);
              return (
                <div
                  key={message.id}
                  className={`flex gap-2.5 ${isUser ? "flex-row-reverse" : ""}`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      isUser
                        ? "bg-primary text-white"
                        : "bg-white border border-border/60 text-primary"
                    }`}
                  >
                    {isUser ? (
                      <MessageCircle className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>
                  {/* Matn */}
                  <div
                    className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                      isUser
                        ? "bg-primary text-white rounded-tr-sm"
                        : "bg-white border border-border/60 text-foreground rounded-tl-sm"
                    }`}
                  >
                    {text || (
                      <span className="inline-flex gap-1 items-center text-muted">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Yuklanish indikatori (javob hali boshlanmagan) */}
            {status === "submitted" && (
              <div className="flex gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white border border-border/60 text-primary flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border border-border/60 rounded-2xl rounded-tl-sm px-3.5 py-3">
                  <span className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-muted/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-muted/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-muted/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </span>
                </div>
              </div>
            )}

            {/* Xatolik */}
            {error && (
              <div className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-2xl px-3.5 py-2.5">
                Kechirasiz, xatolik yuz berdi. Iltimos, qayta urinib ko'ring.
              </div>
            )}
          </div>

          {/* Yozish maydoni */}
          <form
            onSubmit={handleSubmit}
            className="border-t border-border/50 p-3 bg-white shrink-0"
          >
            <div className="flex items-end gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Savolingizni yozing..."
                className="flex-1 px-4 py-2.5 rounded-2xl border border-border/70 bg-cream/20 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="w-11 h-11 inline-flex items-center justify-center bg-primary hover:bg-primary-dark text-white rounded-2xl transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shrink-0"
                aria-label="Yuborish"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
            <p className="text-[10px] text-muted/60 text-center mt-2">
              AI xatolarga yo'l qo'yishi mumkin. Muhim ma'lumotlarni tekshiring.
            </p>
          </form>
        </div>
      )}
    </>
  );
}
