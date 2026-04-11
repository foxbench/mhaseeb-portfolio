import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineChat, HiX, HiOutlinePaperAirplane } from "react-icons/hi";
import { getResponse, getGreeting } from "../data/chatResponses";
import { config } from "../config";

function parseMarkdown(text) {
  const lnk = "text-accent underline underline-offset-2 hover:text-accent-light";
  return text
    .split("\n")
    .map((line, i) => {
      let html = line
        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-text-primary font-semibold">$1</strong>')
        .replace(/_(.*?)_/g, '<em class="text-accent/70">$1</em>')
        .replace(
          /\[([^\]]+)\]\((mailto:[^)]+)\)/g,
          `<a href="$2" class="${lnk}">$1</a>`
        )
        .replace(
          /\[([^\]]+)\]\(([^)]+)\)/g,
          `<a href="$2" target="_blank" rel="noopener" class="${lnk}">$1</a>`
        );

      if (line.startsWith("• ") || line.startsWith("- ")) {
        html = `<span class="text-accent mr-1.5">&#8226;</span>${html.slice(2)}`;
        return `<div key="${i}" class="pl-2 flex items-start gap-0 text-sm leading-relaxed">${html}</div>`;
      }

      return `<p key="${i}" class="text-sm leading-relaxed">${html}</p>`;
    })
    .join("");
}

function Message({ message, isUser }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}
    >
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center text-accent text-xs font-bold mr-2 mt-1 shrink-0">
          H
        </div>
      )}
      <div
        className={`max-w-[85%] px-4 py-3 rounded-2xl ${
          isUser
            ? "bg-accent/15 border border-accent/20 text-text-primary rounded-br-md"
            : "bg-onyx/80 border border-slate-mid/50 text-text-secondary rounded-bl-md"
        }`}
      >
        {isUser ? (
          <p className="text-sm">{message.text}</p>
        ) : (
          <div
            className="space-y-1.5"
            dangerouslySetInnerHTML={{ __html: parseMarkdown(message.text) }}
          />
        )}
      </div>
    </motion.div>
  );
}

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex justify-start mb-3"
    >
      <div className="w-7 h-7 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center text-accent text-xs font-bold mr-2 mt-1 shrink-0">
        H
      </div>
      <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-onyx/80 border border-slate-mid/50">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
              className="w-1.5 h-1.5 rounded-full bg-accent/50"
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function SuggestionCarousel({ suggestions, onSelect }) {
  const trackRef = useRef(null);
  const dragging = useRef(false);
  const startX = useRef(0);
  const scrollStart = useRef(0);
  const moved = useRef(false);

  const onMouseDown = (e) => {
    const el = trackRef.current;
    if (!el) return;
    dragging.current = true;
    moved.current = false;
    startX.current = e.pageX;
    scrollStart.current = el.scrollLeft;
    el.style.cursor = "grabbing";
  };

  const onMouseMove = (e) => {
    if (!dragging.current) return;
    e.preventDefault();
    const dx = e.pageX - startX.current;
    if (Math.abs(dx) > 5) moved.current = true;
    trackRef.current.scrollLeft = scrollStart.current - dx;
  };

  const onMouseUp = () => {
    dragging.current = false;
    if (trackRef.current) trackRef.current.style.cursor = "grab";
  };

  return (
    <div className="px-4 pb-2 shrink-0 overflow-hidden">
      <div
        ref={trackRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        className="flex gap-1.5 overflow-x-auto pb-1 select-none scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none", cursor: "grab" }}
      >
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => { if (!moved.current) onSelect(s); }}
            className="px-3 py-1.5 text-xs font-mono text-accent bg-accent/5 border border-accent/15 rounded-full hover:bg-accent/15 hover:border-accent/30 transition-colors whitespace-nowrap shrink-0"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

// Process the full streaming text so far, extracting any ctx JSON the model
// emitted (wrapped in <ctx>...</ctx> or as a bare {"lang":...} object) at
// either the start or the end. Also hides partial ctx-in-progress so the
// visitor never sees raw JSON during streaming.
//
// Returns { display, ctx } where ctx is the extracted JSON string or null.
function processStreamingText(raw) {
  let text = raw;
  let ctx = null;

  // 1. Wrapped form anywhere: <ctx>{...}</ctx>
  let m = text.match(/\s*<ctx>\s*(\{[^]*?\})\s*<\/ctx>\s*\n?/);
  if (m) {
    ctx = m[1];
    text = (text.slice(0, m.index) + text.slice(m.index + m[0].length)).trim();
    return { display: text, ctx };
  }

  // 2. Bare JSON object containing "lang" at the very end
  m = text.match(/\n*\s*(\{\s*"lang"[^]*\})\s*$/);
  if (m) {
    ctx = m[1];
    return { display: text.slice(0, m.index).trimEnd(), ctx };
  }

  // 3. Bare JSON object containing "lang" at the very start
  m = text.match(/^\s*(\{\s*"lang"[^]*?\})\s*\n+/);
  if (m) {
    ctx = m[1];
    return { display: text.slice(m[0].length), ctx };
  }

  // 4. Hide partial ctx still streaming so it doesn't flash on screen.
  // Trailing unclosed `{` that looks like JSON-in-progress:
  const lastBrace = text.lastIndexOf("{");
  if (lastBrace !== -1 && text.indexOf("}", lastBrace) === -1) {
    const tail = text.slice(lastBrace);
    if (/^\{["\s]/.test(tail) || tail === "{") {
      return { display: text.slice(0, lastBrace).trimEnd(), ctx: null };
    }
  }
  // Trailing partial <ctx tag:
  const lastLt = text.lastIndexOf("<");
  if (lastLt !== -1) {
    const tail = text.slice(lastLt);
    if (/^<\/?(c|ct|ctx|ctx>[^]*)$/.test(tail)) {
      return { display: text.slice(0, lastLt).trimEnd(), ctx: null };
    }
  }

  return { display: text, ctx: null };
}

async function streamChatResponse(conversationHistory, sessionContext, onText, onDone, onError) {
  try {
    const response = await fetch(config.chatApiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: conversationHistory, context: sessionContext }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `HTTP ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let raw = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith("data: ")) continue;

        const data = trimmed.slice(6);
        if (data === "[DONE]") {
          onDone(raw);
          return;
        }

        try {
          const parsed = JSON.parse(data);
          if (parsed.content) {
            raw += parsed.content;
            onText(raw);
          }
          if (parsed.error) throw new Error(parsed.error);
        } catch (e) {
          if (e.message !== "Unexpected end of JSON input") {
            if (e.message && e.message !== e.constructor.name) throw e;
          }
        }
      }
    }

    onDone(raw);
  } catch (err) {
    onError(err);
  }
}

// Keep only the last N raw turns — older context lives in the ctx tag.
const HISTORY_WINDOW = 6;

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [apiAvailable, setApiAvailable] = useState(true);
  const scrollRef = useRef(null);
  const inputRef = useRef(null);
  const streamingTextRef = useRef("");
  const conversationRef = useRef([]);
  const sessionCtxRef = useRef("");

  // Initialize with greeting on first open
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greeting = getGreeting();
      setIsTyping(true);
      setTimeout(() => {
        setMessages([{ id: Date.now(), text: greeting.text, isUser: false }]);
        setSuggestions(greeting.suggestions);
        setIsTyping(false);
      }, 600);
    }
  }, [isOpen, messages.length]);

  // Auto-scroll to bottom on every message/streaming update — like a normal chat
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, isTyping]);

  // Keep input focused
  const refocusInput = useCallback(() => {
    setTimeout(() => inputRef.current?.focus(), 10);
  }, []);

  useEffect(() => {
    if (isOpen) refocusInput();
  }, [isOpen, isStreaming, isTyping, refocusInput]);

  const fallbackResponse = useCallback((text) => {
    const response = getResponse(text);
    setMessages((prev) => [
      ...prev,
      { id: Date.now() + 1, text: response.text, isUser: false },
    ]);
    setSuggestions(response.suggestions);
    setIsTyping(false);
    setIsStreaming(false);
  }, []);

  const sendMessage = useCallback(
    (text) => {
      if (!text.trim() || isStreaming) return;

      const trimmed = text.trim();
      const userMsg = { id: Date.now(), text: trimmed, isUser: true };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setSuggestions([]);
      setIsTyping(true);

      conversationRef.current = [
        ...conversationRef.current,
        { role: "user", content: trimmed },
      ].slice(-HISTORY_WINDOW);

      if (!apiAvailable) {
        setTimeout(() => fallbackResponse(trimmed), 600);
        return;
      }

      const streamingMsgId = Date.now() + 1;
      streamingTextRef.current = "";

      streamChatResponse(
        conversationRef.current,
        sessionCtxRef.current,
        (rawText) => {
          const { display, ctx } = processStreamingText(rawText);
          if (ctx) {
            try {
              JSON.parse(ctx);
              sessionCtxRef.current = ctx;
            } catch {
              // Invalid JSON — keep prior ctx.
            }
          }
          if (!display) return;
          if (streamingTextRef.current === "") {
            setIsTyping(false);
            setIsStreaming(true);
          }
          streamingTextRef.current = display;
          setMessages((prev) => {
            const existing = prev.find((m) => m.id === streamingMsgId);
            if (existing) {
              return prev.map((m) =>
                m.id === streamingMsgId ? { ...m, text: display } : m
              );
            }
            return [
              ...prev,
              { id: streamingMsgId, text: display, isUser: false },
            ];
          });
        },
        (rawFinal) => {
          // Final pass — catch ctx that only became extractable at the end.
          const { display, ctx } = processStreamingText(rawFinal);
          if (ctx) {
            try { JSON.parse(ctx); sessionCtxRef.current = ctx; } catch { /* noop */ }
          }
          if (display && display !== streamingTextRef.current) {
            streamingTextRef.current = display;
            setMessages((prev) =>
              prev.map((m) => (m.id === streamingMsgId ? { ...m, text: display } : m))
            );
          }
          setIsTyping(false);
          setIsStreaming(false);
          if (streamingTextRef.current) {
            conversationRef.current = [
              ...conversationRef.current,
              { role: "assistant", content: streamingTextRef.current },
            ].slice(-HISTORY_WINDOW);
          }
          setSuggestions(["Skills & expertise", "Projects", "AI experience", "Contact info"]);
        },
        (err) => {
          console.warn("Chat API error, falling back to local:", err.message);
          setApiAvailable(false);
          if (streamingTextRef.current) {
            setIsTyping(false);
            setIsStreaming(false);
            setSuggestions(["Skills & expertise", "Projects", "Contact info"]);
          } else {
            fallbackResponse(trimmed);
          }
        }
      );
    },
    [isStreaming, apiAvailable, fallbackResponse]
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
    refocusInput();
  };

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-accent text-void shadow-xl shadow-accent/25 flex items-center justify-center hover:bg-accent-light transition-colors"
          >
            <HiOutlineChat size={24} />
            <span className="absolute inset-0 rounded-full bg-accent/20 animate-ping" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat panel — 60% screen height */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50 w-[400px] max-w-[calc(100vw-3rem)] flex flex-col rounded-2xl overflow-hidden border border-accent/15 shadow-2xl shadow-black/40"
            style={{ background: "var(--t-glass-bg)", height: "60vh", maxHeight: "calc(100vh - 3rem)" }}
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-accent/10 flex items-center justify-between bg-obsidian/80 backdrop-blur-sm shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center text-accent font-bold text-sm">
                  H
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-text-primary">Haseeb's AI Assistant</h4>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${apiAvailable ? "bg-accent" : "bg-amber-400"}`} />
                    <span className="text-xs text-text-muted">
                      {isStreaming ? "Typing..." : apiAvailable ? "Online" : "Offline mode"}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-slate-mid/50 flex items-center justify-center text-text-muted hover:text-text-primary transition-colors"
              >
                <HiX size={18} />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-0">
              {messages.map((msg) => (
                <Message key={msg.id} message={msg} isUser={msg.isUser} />
              ))}
              {isTyping && <TypingIndicator />}
            </div>

            {/* Suggestions — drag-scrollable horizontal carousel */}
            {suggestions.length > 0 && !isTyping && !isStreaming && (
              <SuggestionCarousel suggestions={suggestions} onSelect={sendMessage} />
            )}

            {/* Input */}
            <form onSubmit={handleSubmit} className="px-4 pb-3 pt-2 border-t border-accent/10 shrink-0">
              <div className="flex items-center gap-2 bg-onyx/60 border border-slate-mid/50 rounded-xl px-3 py-2 focus-within:border-accent/30 transition-colors">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={isStreaming ? "AI is responding..." : "Ask me anything..."}
                  className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isStreaming}
                  className="w-8 h-8 rounded-lg bg-accent/20 text-accent flex items-center justify-center hover:bg-accent/30 disabled:opacity-30 disabled:hover:bg-accent/20 transition-colors"
                >
                  <HiOutlinePaperAirplane size={14} className="rotate-90" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
