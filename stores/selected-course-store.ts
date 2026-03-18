import { create } from "zustand";

import type { EnrollmentResponseDto } from "@/features/enrollments/types";

type SelectedCourseStore = {
  selectedCourse: EnrollmentResponseDto | null;
  setSelectedCourse: (course: EnrollmentResponseDto) => void;
  clearSelectedCourse: () => void;
};

export const useSelectedCourseStore = create<SelectedCourseStore>((set) => ({
  selectedCourse: null,
  setSelectedCourse: (course) => set({ selectedCourse: course }),
  clearSelectedCourse: () => set({ selectedCourse: null }),
}));
