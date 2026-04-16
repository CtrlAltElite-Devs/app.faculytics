import { ScopedFacultyListScreen } from "@/features/faculty-analytics";

export default function ChairpersonFacultiesPage() {
  return <ScopedFacultyListScreen scopeLabel="Program" allowAllPrograms={false} />;
}
