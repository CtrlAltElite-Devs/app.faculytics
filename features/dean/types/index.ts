// Temporary types derived from mock data.
// Replace with backend DTOs when wiring to the real API.
// See features/dean/MIGRATION.md for the target response shapes.

export type QuantitativeMetricScore = {
  metric: string;
  score: number;
};

export type SemesterKey = "firstSemester" | "secondSemester" | "summerSemester";

export type FacultyAnalysisSemesterKey = SemesterKey;

export type QualitativeTheme = {
  label: string;
  mentions: number;
};

export type QualitativeActionPlan = {
  title: string;
  items: string[];
};

export type QualitativeInsight = {
  title: string;
  description: string;
};

export type FacultyFeedbackRecord = {
  date: string;
  feedback: string;
  sentiment: "Positive" | "Neutral" | "Negative";
  type: "In Classroom" | "Out of Classroom" | "Student Evaluation";
};
