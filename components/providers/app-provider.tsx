import { TooltipProvider } from "../ui/tooltip";
import QueryProvider from "./query-provider";

export default function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <QueryProvider>
        {children}
      </QueryProvider>
    </TooltipProvider>
  )
}
