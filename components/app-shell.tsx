"use client"

import { useEffect } from "react"
import { useAppStore } from "@/lib/store"
import { AppSidebar } from "@/components/app-sidebar"
import { TopNav } from "@/components/top-nav"
import { DashboardView } from "@/components/views/dashboard-view"
import { ForecastView } from "@/components/views/forecast-view"
import { ComparisonView } from "@/components/views/comparison-view"
import { UploadView } from "@/components/views/upload-view"
import { SettingsView } from "@/components/views/settings-view"
import { BehaviorView } from "@/components/views/behavior-view"
import { AiAssistantPanel } from "@/components/ai-assistant-panel"

export function AppShell() {
  const { view, sidebarOpen, assistantOpen, initializePrebuiltData } =
    useAppStore()

  useEffect(() => {
    initializePrebuiltData()
  }, [initializePrebuiltData])

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Left Sidebar */}
      <AppSidebar open={sidebarOpen} />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopNav />
        <main className="flex-1 overflow-auto">
          <div className="mx-auto max-w-[1440px] p-6">
            {view === "dashboard" && <DashboardView />}
            {view === "forecast" && <ForecastView />}
            {view === "comparison" && <ComparisonView />}
            {view === "behavior" && <BehaviorView />}
            {view === "upload" && <UploadView />}
            {view === "settings" && <SettingsView />}
          </div>
        </main>
      </div>

      {/* Right AI Panel */}
      {assistantOpen && <AiAssistantPanel />}
    </div>
  )
}
