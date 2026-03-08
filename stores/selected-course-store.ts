import { create } from "zustand";

import type { CourseShortResponseDto } from "@/types/enrollments";

type SelectedCourseStore = {
  selectedCourse: CourseShortResponseDto | null;
  setSelectedCourse: (course: CourseShortResponseDto) => void;
};

export const useSelectedCourseStore = create<SelectedCourseStore>((set) => ({
  selectedCourse: null,
  setSelectedCourse: (course) => set({ selectedCourse: course }),
}));
