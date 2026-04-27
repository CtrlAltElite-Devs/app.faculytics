export const HIDDEN_FACULTY_IDS: ReadonlySet<string> = new Set([
  "22e99302-3977-462d-8840-5cb33d1b193a",
]);

export function isHiddenFaculty(facultyId: string): boolean {
  return HIDDEN_FACULTY_IDS.has(facultyId);
}
