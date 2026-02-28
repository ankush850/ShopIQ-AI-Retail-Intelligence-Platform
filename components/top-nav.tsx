"use client"

import { useAppStore } from "@/lib/store"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Database, Cpu } from "lucide-react"
import { useTheme } from "next-themes"

export function TopNav() {
  const { mode, setMode, modelMetrics, activeData } = useAppStore()
  const { theme, setTheme } = useTheme()

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-card px-6">
      <div className="flex items-center gap-4">
        {/* Mode Toggle */}
        <div className="flex items-center gap-1 rounded-lg bg-secondary p-0.5">
          <button
            onClick={() => setMode("prebuilt")}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              mode === "prebuilt"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Prebuilt
          </button>
          <button
            onClick={() => setMode("analysis")}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              mode === "analysis"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Analysis
          </button>
        </div>

        {/* Dataset Indicator */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Database className="h-3.5 w-3.5" />
          <span>
            {mode === "prebuilt" ? "Internal Dataset" : activeData ? "User Dataset" : "No Dataset"}
          </span>
          {activeData && (
            <Badge variant="secondary" className="text-xs">
              {activeData.summary.cleanedRows.toLocaleString()} rows
            </Badge>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Model Status */}
        {modelMetrics && (
          <div className="flex items-center gap-2">
            <Cpu className="h-3.5 w-3.5 text-accent" />
            <Badge
              variant="outline"
              className="border-accent/30 text-accent text-xs"
            >
              R{"\u00B2"} {modelMetrics.r2.toFixed(3)} | {modelMetrics.version}
            </Badge>
          </div>
        )}

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </header>
  )
}
