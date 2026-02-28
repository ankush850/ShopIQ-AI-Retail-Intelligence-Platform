"use client"

import {
  LayoutDashboard,
  TrendingUp,
  GitCompareArrows,
  Upload,
  Bot,
  Settings,
  ChevronLeft,
  ChevronRight,
  Users,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAppStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { AppView } from "@/lib/types"

const NAV_ITEMS: { icon: typeof LayoutDashboard; label: string; view: AppView }[] = [
  { icon: LayoutDashboard, label: "Dashboard", view: "dashboard" },
  { icon: TrendingUp, label: "Forecast", view: "forecast" },
  { icon: GitCompareArrows, label: "Comparison", view: "comparison" },
  { icon: Users, label: "Shopper Behavior", view: "behavior" },
  { icon: Upload, label: "Upload Data", view: "upload" },
  { icon: Settings, label: "Settings", view: "settings" },
]

export function AppSidebar({ open }: { open: boolean }) {
  const { view, setView, toggleSidebar, toggleAssistant, assistantOpen } = useAppStore()

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "flex flex-col border-r border-border bg-sidebar transition-all duration-300",
          open ? "w-56" : "w-16"
        )}
      >
        {/* Logo */}
        <div className="flex h-14 items-center gap-3 border-b border-border px-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <TrendingUp className="h-4 w-4" />
          </div>
          {open && (
            <span className="text-sm font-semibold text-foreground tracking-tight">
              ShopIQ
            </span>
          )}
        </div>

        {/* Nav Items */}
        <nav className="flex-1 space-y-1 p-2">
          {NAV_ITEMS.map((item) => {
            const isActive = view === item.view
            return (
              <Tooltip key={item.view}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setView(item.view)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-sidebar-accent text-sidebar-primary"
                        : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {open && <span>{item.label}</span>}
                  </button>
                </TooltipTrigger>
                {!open && (
                  <TooltipContent side="right">
                    <p>{item.label}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            )
          })}
        </nav>

        {/* AI Assistant Toggle */}
        <div className="border-t border-border p-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={toggleAssistant}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  assistantOpen
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                <Bot className="h-4 w-4 shrink-0" />
                {open && <span>AI Assistant</span>}
              </button>
            </TooltipTrigger>
            {!open && (
              <TooltipContent side="right">
                <p>AI Assistant</p>
              </TooltipContent>
            )}
          </Tooltip>
        </div>

        {/* Collapse Toggle */}
        <div className="border-t border-border p-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="w-full justify-center"
          >
            {open ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>
      </aside>
    </TooltipProvider>
  )
}
