import QueryProvider from "./query-provider";

export default function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      {children}
    </QueryProvider>
  )
}
