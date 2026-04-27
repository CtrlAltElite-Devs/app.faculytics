import { ScopedFacultyListScreen } from "@/features/faculty-analytics";

export default function ChairpersonFacultyPage() {
  return <ScopedFacultyListScreen scopeLabel="Program" allowAllPrograms={false} />;
}
