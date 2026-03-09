export type GetMyEnrollmentsQuery = {
  page: number;
  limit: number;
};

export type CourseShortResponseDto = {
  id: string;
  moodleCourseId: number;
  shortname: string;
  fullname: string;
};

export type FacultyShortResponseDto = {
  id: string;
  fullName: string;
  employeeNumber?: string;
  profilePicture?: string;
};

export type EnrollmentResponseDto = {
  id: string;
  role: string;
  course: CourseShortResponseDto;
  faculty?: FacultyShortResponseDto | null;
};

export type PaginationMeta = {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
};

export type MyEnrollmentsResponseDto = {
  data: EnrollmentResponseDto[];
  meta: PaginationMeta;
};
