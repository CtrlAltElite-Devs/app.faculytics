export type DeanEvaluationFacultyRow = {
  id: string;
  fullName: string;
  profilePicture?: string | null;
  departmentName?: string | null;
  subjects: string[];
  statusLabel: string;
  statusTone: "ready" | "pending";
};

export const deanEvaluationMockFacultyRows: DeanEvaluationFacultyRow[] = [
  {
    id: "mock-faculty-1",
    fullName: "Amelia Reyes",
    departmentName: "Computer Science",
    subjects: ["Advanced Databases", "Data Structures"],
    statusLabel: "Ready for evaluation",
    statusTone: "ready",
  },
  {
    id: "mock-faculty-2",
    fullName: "Marcus Dela Cruz",
    departmentName: "Information Systems",
    subjects: ["Enterprise Systems", "Systems Analysis"],
    statusLabel: "Awaiting live semester data",
    statusTone: "pending",
  },
  {
    id: "mock-faculty-3",
    fullName: "Sofia Mendoza",
    departmentName: "Computer Science",
    subjects: ["Human-Computer Interaction", "Web Engineering"],
    statusLabel: "Ready for evaluation",
    statusTone: "ready",
  },
  {
    id: "mock-faculty-4",
    fullName: "Ethan Navarro",
    departmentName: "Information Technology",
    subjects: ["Networks", "Operating Systems"],
    statusLabel: "Awaiting live semester data",
    statusTone: "pending",
  },
];
