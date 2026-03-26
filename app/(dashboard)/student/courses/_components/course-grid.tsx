import type { EnrollmentResponseDto } from "@/features/enrollments/types";

import CourseCard from "./course-card";

type CourseGridProps = {
  enrollments: EnrollmentResponseDto[];
  onSelectCourse: (enrollment: EnrollmentResponseDto) => void;
};

export function CourseGrid({ enrollments, onSelectCourse }: CourseGridProps) {
  return (
    <>
      {enrollments.map((enrollment) => (
        <CourseCard
          key={enrollment.id}
          shortname={enrollment.course.shortname}
          fullname={enrollment.course.fullname}
          teacherName={enrollment.faculty?.fullName ?? "Teacher unavailable"}
          teacherImageSrc={enrollment.faculty?.profilePicture}
          sectionName={enrollment.section?.name}
          imageSrc={enrollment.course.courseImage}
          feedbackHref={`/student/courses/${enrollment.course.id}/evaluation`}
          onGiveFeedback={() => onSelectCourse(enrollment)}
          submitted={enrollment.submission?.submitted}
        />
      ))}
    </>
  );
}
