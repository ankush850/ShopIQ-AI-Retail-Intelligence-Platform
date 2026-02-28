"use client"

import { useState, useRef, useEffect } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Bot,
  Send,
  X,
  Sparkles,
  Database,
  Loader2,
} from "lucide-react"

const QUICK_PROMPTS = [
  "What is the total revenue?",
  "Which category performs best?",
  "Explain the forecast confidence",
  "Are there any anomalies?",
  "Summarize the dataset",
  "Compare monthly growth",
]

function getUIMessageText(msg: { parts?: Array<{ type: string; text?: string }> }): string {
  if (!msg.parts || !Array.isArray(msg.parts)) return ""
  return msg.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("")
}

export function AiAssistantPanel() {
  const { toggleAssistant, activeData, mode, kpis, forecast, modelMetrics } =
    useAppStore()
  const [input, setInput] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)

  // Build data context for the API
  const dataContext = activeData && kpis && modelMetrics
    ? {
        mode,
        totalRevenue: kpis.totalRevenue,
        monthlyGrowth: kpis.monthlyGrowth,
        topCategory: kpis.topCategory,
        categories: activeData.features.categoryDistribution.map((c) => c.name),
        monthlyRevenue: activeData.features.monthlyRevenue,
        modelR2: modelMetrics.r2,
        forecastSummary: forecast
          ? `Next 6 months predicted: ${forecast.predicted.map((p) => `${p.month}: $${p.revenue.toLocaleString()}`).join(", ")}`
          : "No forecast generated",
        rowCount: activeData.summary.cleanedRows,
      }
    : undefined

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      prepareSendMessagesRequest: ({ id, messages: msgs }) => ({
        body: {
          messages: msgs,
          dataContext,
          id,
        },
      }),
    }),
  })

  const isLoading = status === "streaming" || status === "submitted"

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = (text?: string) => {
    const msg = text || input.trim()
    if (!msg || isLoading) return
    sendMessage({ text: msg })
    setInput("")
  }

  return (
    <aside className="flex w-80 flex-col border-l border-border bg-card lg:w-96">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
            <Bot className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-card-foreground">
              AI Assistant
            </p>
            <div className="flex items-center gap-1">
              <Database className="h-2.5 w-2.5 text-muted-foreground" />
              <p className="text-[10px] text-muted-foreground">
                {activeData
                  ? `${mode === "prebuilt" ? "Internal" : "User"} - ${activeData.summary.cleanedRows} rows`
                  : "No dataset"}
              </p>
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={toggleAssistant}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close assistant</span>
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 px-4" ref={scrollRef}>
        <div className="space-y-4 py-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center gap-3 py-8">
              <div className="rounded-full bg-primary/10 p-3">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <p className="text-center text-sm text-muted-foreground">
                Ask me anything about your shopping data, forecasts, or model
                performance.
              </p>
              {/* Quick Prompts */}
              <div className="flex flex-wrap justify-center gap-2 mt-2">
                {QUICK_PROMPTS.slice(0, 4).map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSend(prompt)}
                    className="rounded-lg border border-border bg-secondary/50 px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message) => {
            const text = getUIMessageText(message)
            if (!text) return null

            return (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Bot className="h-3 w-3 text-primary" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  {text.split("\n").map((line, i) => (
                    <p key={i} className={i > 0 ? "mt-1.5" : ""}>
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            )
          })}

          {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
            <div className="flex gap-3">
              <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Bot className="h-3 w-3 text-primary" />
              </div>
              <div className="rounded-xl bg-secondary px-3.5 py-2.5">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t border-border p-3">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSend()
          }}
          className="flex items-center gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your data..."
            disabled={isLoading}
            className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 disabled:opacity-50"
          />
          <Button
            type="submit"
            size="icon"
            className="h-9 w-9 shrink-0"
            disabled={isLoading || !input.trim()}
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </form>
      </div>
    </aside>
  )
}
