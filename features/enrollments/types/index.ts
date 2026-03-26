export type GetMyEnrollmentsQuery = {
  page: number;
  limit: number;
};

export type CourseShortResponseDto = {
  id: string;
  moodleCourseId: number;
  shortname: string;
  fullname: string;
  courseImage?: string;
};

export type FacultyShortResponseDto = {
  id: string;
  fullName: string;
  employeeNumber?: string;
  profilePicture?: string;
};

export type SemesterShortResponseDto = {
  id: string;
  code: string;
  label?: string;
  academicYear?: string;
};

export type SectionShortResponseDto = {
  id: string;
  name: string;
};

export type SubmissionStatusDto = {
  submitted: boolean;
  submittedAt?: string;
};

export type EnrollmentResponseDto = {
  id: string;
  role: string;
  course: CourseShortResponseDto;
  faculty?: FacultyShortResponseDto | null;
  semester?: SemesterShortResponseDto | null;
  section?: SectionShortResponseDto | null;
  submission: SubmissionStatusDto;
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
