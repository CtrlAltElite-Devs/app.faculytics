import { create } from "zustand";

import type { EnrollmentResponseDto } from "@/types/enrollments";

type SelectedCourseStore = {
  selectedCourse: EnrollmentResponseDto | null;
  setSelectedCourse: (course: EnrollmentResponseDto) => void;
};

export const useSelectedCourseStore = create<SelectedCourseStore>((set) => ({
  selectedCourse: null,
  setSelectedCourse: (course) => set({ selectedCourse: course }),
}));
