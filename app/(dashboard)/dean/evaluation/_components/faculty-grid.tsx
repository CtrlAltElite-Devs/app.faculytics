import type { DeanEvaluationFacultyRow } from "./mock-faculty-data";
import { FacultyCard } from "./faculty-card";

type FacultyGridProps = {
  facultyRows: DeanEvaluationFacultyRow[];
};

export function FacultyGrid({ facultyRows }: FacultyGridProps) {
  return (
    <>
      {facultyRows.map((faculty) => (
        <FacultyCard key={faculty.id} {...faculty} />
      ))}
    </>
  );
}
