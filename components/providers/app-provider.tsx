"use client"

import { ThemeProvider } from "@/components/theme-provider"

import { TooltipProvider } from "../ui/tooltip"
import QueryProvider from "./query-provider"

export default function AppProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <TooltipProvider>
        <QueryProvider>{children}</QueryProvider>
      </TooltipProvider>
    </ThemeProvider>
  )
}
