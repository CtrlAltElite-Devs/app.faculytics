export const deanAnalyticsMock = {
  lastUpdated: "Today, 2:30 PM",
  statCards: [
    {
      title: "Faculty Members",
      value: "128",
      hint: "Active faculty members across the department",
    },
    {
      title: "Student Responses",
      value: "3,842",
      hint: "Submitted evaluation responses this term",
    },
    {
      title: "Positive Sentiment Rate",
      value: "84.6%",
      hint: "Average favorable sentiment across all faculties",
    },
    {
      title: "Department Courses",
      value: "46",
      hint: "Courses currently handled by the department",
    },
  ],
  sentimentBarChartData: [
    { sentiment: "Positive", firstSemester: 84, secondSemester: 88 },
    { sentiment: "Negative", firstSemester: 9, secondSemester: 6 },
    { sentiment: "Neutral", firstSemester: 7, secondSemester: 6 },
  ],
  sentimentPieChartData: [
    { label: "Positive", value: 86, fill: "var(--color-brand-blue)" },
    { label: "Neutral", value: 8, fill: "#B8BDC7" },
    { label: "Negative", value: 6, fill: "var(--color-brand-yellow)" },
  ],
};
