export const deanAnalyticsSampleData = {
  academicYears: ["2026 - 2027"],
  selectedAcademicYear: "2026 - 2027",
  lastUpdated: "Today, 2:30 PM",
  summary: {
    faculties: 128,
    studentResponses: 3842,
    positiveSentimentRate: 84.6,
    courses: 46,
  },
  semesterSentiment: [
    { sentiment: "Positive", firstSemester: 84, secondSemester: 88 },
    { sentiment: "Negative", firstSemester: 9, secondSemester: 6 },
    { sentiment: "Neutral", firstSemester: 7, secondSemester: 6 },
  ],
  overallSentiment: [
    { label: "Positive", value: 172, color: "#5b8cff" },
    { label: "Neutral", value: 13, color: "#d1d5db" },
    { label: "Negative", value: 15, color: "#facc15" },
  ],
} as const;
