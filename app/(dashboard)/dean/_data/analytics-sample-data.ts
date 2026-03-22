type QuantitativeMetricScore = {
  metric: string;
  score: number;
};

const quantitativeQuestionnaireTemplates = {
  "Instructional Clarity": [
    "Explains lessons in a clear and understandable manner.",
    "Uses examples that help students grasp key ideas.",
    "Presents objectives and instructions clearly during class.",
  ],
  Pacing: [
    "Maintains a class pace that supports student understanding.",
    "Allows enough time for activities and explanations.",
    "Adjusts lesson flow based on student learning needs.",
  ],
  "Discussion Quality": [
    "Encourages meaningful classroom discussion.",
    "Responds thoughtfully to student questions during class.",
    "Facilitates discussions that deepen understanding of the topic.",
  ],
  "Classroom Management": [
    "Maintains an organized and focused classroom environment.",
    "Handles classroom disruptions appropriately and fairly.",
    "Uses class time efficiently and productively.",
  ],
  "Learning Environment": [
    "Creates a classroom atmosphere that supports learning.",
    "Encourages respect and participation among students.",
    "Makes students feel comfortable engaging in class activities.",
  ],
  "Consultation Availability": [
    "Is available for consultation when students need guidance.",
    "Provides enough opportunities for academic consultation.",
    "Makes consultation arrangements accessible to students.",
  ],
  "Response Timeliness": [
    "Responds to student messages within a reasonable time.",
    "Returns requested feedback or clarifications promptly.",
    "Addresses academic concerns without unnecessary delay.",
  ],
  "Resource Sharing": [
    "Shares helpful learning materials beyond class sessions.",
    "Provides resources that support independent study.",
    "Makes supplementary materials accessible to students.",
  ],
  "Feedback Quality": [
    "Gives feedback that is useful for improvement.",
    "Provides comments that are specific and actionable.",
    "Explains strengths and weaknesses clearly in feedback.",
  ],
  "Student Support": [
    "Shows concern for student progress outside the classroom.",
    "Provides academic support when students encounter difficulty.",
    "Encourages students to keep improving their performance.",
  ],
  "Subject Mastery": [
    "Demonstrates strong knowledge of the subject matter.",
    "Answers student questions with confidence and accuracy.",
    "Connects lesson content to broader course concepts effectively.",
  ],
  "Student Engagement": [
    "Motivates students to participate in learning activities.",
    "Uses strategies that keep students attentive and involved.",
    "Encourages active participation throughout the learning process.",
  ],
  "Assessment Fairness": [
    "Uses grading criteria that are fair and consistent.",
    "Aligns assessments with the topics discussed in class.",
    "Evaluates student work objectively and transparently.",
  ],
  Professionalism: [
    "Displays professionalism in interactions with students.",
    "Demonstrates respect, preparedness, and reliability.",
    "Acts as a positive role model in the academic setting.",
  ],
  "Overall Satisfaction": [
    "Meets expectations as an instructor for this course.",
    "Contributes positively to the overall learning experience.",
    "Would be rated favorably based on overall teaching performance.",
  ],
} as const;

function roundToTwoDecimals(value: number) {
  return Number(value.toFixed(2));
}

function createMetricQuestions(score: number, questions: readonly string[]) {
  return questions.map((question, questionIndex) => {
    if (score === 5) {
      return {
        question,
        average: 5,
      };
    }

    if (questionIndex === 0) {
      return {
        question,
        average: roundToTwoDecimals(Math.max(1, score - 0.1)),
      };
    }

    if (questionIndex === 1) {
      return {
        question,
        average: roundToTwoDecimals(score),
      };
    }

    return {
      question,
      average: roundToTwoDecimals(Math.min(5, score + 0.1)),
    };
  });
}

function createQuantitativeMetricView(metrics: readonly QuantitativeMetricScore[]) {
  return {
    metrics: metrics.map(({ metric, score }) => ({
      metric,
      score,
      questions: createMetricQuestions(score, quantitativeQuestionnaireTemplates[metric]),
    })),
  };
}

function createQuantitativeMetricViews(metricViews: {
  classroom: readonly QuantitativeMetricScore[];
  outOfClassroom: readonly QuantitativeMetricScore[];
  studentEvaluation: readonly QuantitativeMetricScore[];
}) {
  return {
    classroom: createQuantitativeMetricView(metricViews.classroom),
    outOfClassroom: createQuantitativeMetricView(metricViews.outOfClassroom),
    studentEvaluation: createQuantitativeMetricView(metricViews.studentEvaluation),
  };
}

const defaultQuantitativeMetricViews = createQuantitativeMetricViews({
  classroom: [
    { metric: "Instructional Clarity", score: 4.8 },
    { metric: "Pacing", score: 4.6 },
    { metric: "Discussion Quality", score: 4.7 },
    { metric: "Classroom Management", score: 4.7 },
    { metric: "Learning Environment", score: 4.8 },
  ],
  outOfClassroom: [
    { metric: "Consultation Availability", score: 4.5 },
    { metric: "Response Timeliness", score: 4.4 },
    { metric: "Resource Sharing", score: 4.6 },
    { metric: "Feedback Quality", score: 4.5 },
    { metric: "Student Support", score: 4.6 },
  ],
  studentEvaluation: [
    { metric: "Subject Mastery", score: 4.9 },
    { metric: "Student Engagement", score: 4.6 },
    { metric: "Assessment Fairness", score: 4.5 },
    { metric: "Professionalism", score: 4.8 },
    { metric: "Overall Satisfaction", score: 4.7 },
  ],
});

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
  facultyAnalysis: [
    {
      facultySlug: "amelia-reyes",
      facultyName: "Dr. Amelia Reyes",
      facultyInitials: "AR",
      subjects: [
        "Data Structures",
        "Algorithms",
        "Discrete Mathematics",
        "Automata Theory",
      ],
      averageRating: 4.7,
      overallPositiveRate: "89.4%",
      responses: 412,
      quantitativeMetrics: defaultQuantitativeMetricViews,
    },
    {
      facultySlug: "marcus-dela-cruz",
      facultyName: "Prof. Marcus Dela Cruz",
      facultyInitials: "MC",
      subjects: [
        "Operating Systems",
        "Computer Networks",
        "Cybersecurity",
      ],
      averageRating: 4.4,
      overallPositiveRate: "85.1%",
      responses: 376,
      quantitativeMetrics: createQuantitativeMetricViews({
        classroom: [
          { metric: "Instructional Clarity", score: 4.4 },
          { metric: "Pacing", score: 4.2 },
          { metric: "Discussion Quality", score: 4.3 },
          { metric: "Classroom Management", score: 4.5 },
          { metric: "Learning Environment", score: 4.4 },
        ],
        outOfClassroom: [
          { metric: "Consultation Availability", score: 4.1 },
          { metric: "Response Timeliness", score: 4.2 },
          { metric: "Resource Sharing", score: 4.4 },
          { metric: "Feedback Quality", score: 4.3 },
          { metric: "Student Support", score: 4.2 },
        ],
        studentEvaluation: [
          { metric: "Subject Mastery", score: 4.7 },
          { metric: "Student Engagement", score: 4.2 },
          { metric: "Assessment Fairness", score: 4.3 },
          { metric: "Professionalism", score: 4.5 },
          { metric: "Overall Satisfaction", score: 4.4 },
        ],
      }),
    },
    {
      facultySlug: "sofia-mendoza",
      facultyName: "Dr. Sofia Mendoza",
      facultyInitials: "SM",
      subjects: [
        "Human Computer Interaction",
        "Software Engineering",
        "Capstone Project",
        "Systems Analysis",
        "Information Management",
      ],
      averageRating: 4.8,
      overallPositiveRate: "91.8%",
      responses: 508,
      quantitativeMetrics: createQuantitativeMetricViews({
        classroom: [
          { metric: "Instructional Clarity", score: 4.9 },
          { metric: "Pacing", score: 4.8 },
          { metric: "Discussion Quality", score: 4.9 },
          { metric: "Classroom Management", score: 4.8 },
          { metric: "Learning Environment", score: 4.9 },
        ],
        outOfClassroom: [
          { metric: "Consultation Availability", score: 4.8 },
          { metric: "Response Timeliness", score: 4.7 },
          { metric: "Resource Sharing", score: 4.9 },
          { metric: "Feedback Quality", score: 4.8 },
          { metric: "Student Support", score: 4.9 },
        ],
        studentEvaluation: [
          { metric: "Subject Mastery", score: 4.8 },
          { metric: "Student Engagement", score: 4.9 },
          { metric: "Assessment Fairness", score: 4.7 },
          { metric: "Professionalism", score: 4.8 },
          { metric: "Overall Satisfaction", score: 4.9 },
        ],
      }),
    },
    {
      facultySlug: "ethan-navarro",
      facultyName: "Dr. Ethan Navarro",
      facultyInitials: "EN",
      subjects: ["Database Systems", "Data Warehousing", "SQL Programming"],
      averageRating: 4.5,
      overallPositiveRate: "88.2%",
      responses: 441,
      quantitativeMetrics: createQuantitativeMetricViews({
        classroom: [
          { metric: "Instructional Clarity", score: 4.6 },
          { metric: "Pacing", score: 4.5 },
          { metric: "Discussion Quality", score: 4.4 },
          { metric: "Classroom Management", score: 4.5 },
          { metric: "Learning Environment", score: 4.5 },
        ],
        outOfClassroom: [
          { metric: "Consultation Availability", score: 4.4 },
          { metric: "Response Timeliness", score: 4.3 },
          { metric: "Resource Sharing", score: 4.6 },
          { metric: "Feedback Quality", score: 4.5 },
          { metric: "Student Support", score: 4.4 },
        ],
        studentEvaluation: [
          { metric: "Subject Mastery", score: 4.7 },
          { metric: "Student Engagement", score: 4.4 },
          { metric: "Assessment Fairness", score: 4.5 },
          { metric: "Professionalism", score: 4.6 },
          { metric: "Overall Satisfaction", score: 4.5 },
        ],
      }),
    },
    {
      facultySlug: "liza-fernandez",
      facultyName: "Prof. Liza Fernandez",
      facultyInitials: "LF",
      subjects: ["Web Development", "UI Design", "Frontend Frameworks", "Accessibility"],
      averageRating: 4.4,
      overallPositiveRate: "86.7%",
      responses: 394,
      quantitativeMetrics: createQuantitativeMetricViews({
        classroom: [
          { metric: "Instructional Clarity", score: 4.5 },
          { metric: "Pacing", score: 4.4 },
          { metric: "Discussion Quality", score: 4.5 },
          { metric: "Classroom Management", score: 4.4 },
          { metric: "Learning Environment", score: 4.5 },
        ],
        outOfClassroom: [
          { metric: "Consultation Availability", score: 4.3 },
          { metric: "Response Timeliness", score: 4.4 },
          { metric: "Resource Sharing", score: 4.5 },
          { metric: "Feedback Quality", score: 4.3 },
          { metric: "Student Support", score: 4.4 },
        ],
        studentEvaluation: [
          { metric: "Subject Mastery", score: 4.4 },
          { metric: "Student Engagement", score: 4.5 },
          { metric: "Assessment Fairness", score: 4.3 },
          { metric: "Professionalism", score: 4.5 },
          { metric: "Overall Satisfaction", score: 4.4 },
        ],
      }),
    },
    {
      facultySlug: "paolo-ramirez",
      facultyName: "Dr. Paolo Ramirez",
      facultyInitials: "PR",
      subjects: ["Artificial Intelligence", "Machine Learning", "Deep Learning"],
      averageRating: 4.7,
      overallPositiveRate: "90.5%",
      responses: 467,
      quantitativeMetrics: createQuantitativeMetricViews({
        classroom: [
          { metric: "Instructional Clarity", score: 4.8 },
          { metric: "Pacing", score: 4.6 },
          { metric: "Discussion Quality", score: 4.7 },
          { metric: "Classroom Management", score: 4.7 },
          { metric: "Learning Environment", score: 4.8 },
        ],
        outOfClassroom: [
          { metric: "Consultation Availability", score: 4.7 },
          { metric: "Response Timeliness", score: 4.6 },
          { metric: "Resource Sharing", score: 4.8 },
          { metric: "Feedback Quality", score: 4.6 },
          { metric: "Student Support", score: 4.7 },
        ],
        studentEvaluation: [
          { metric: "Subject Mastery", score: 4.9 },
          { metric: "Student Engagement", score: 4.6 },
          { metric: "Assessment Fairness", score: 4.6 },
          { metric: "Professionalism", score: 4.8 },
          { metric: "Overall Satisfaction", score: 4.7 },
        ],
      }),
    },
    {
      facultySlug: "nina-torres",
      facultyName: "Prof. Nina Torres",
      facultyInitials: "NT",
      subjects: ["Project Management", "IT Governance", "Enterprise Systems"],
      averageRating: 4.3,
      overallPositiveRate: "84.9%",
      responses: 352,
      quantitativeMetrics: createQuantitativeMetricViews({
        classroom: [
          { metric: "Instructional Clarity", score: 4.3 },
          { metric: "Pacing", score: 4.2 },
          { metric: "Discussion Quality", score: 4.2 },
          { metric: "Classroom Management", score: 4.3 },
          { metric: "Learning Environment", score: 4.3 },
        ],
        outOfClassroom: [
          { metric: "Consultation Availability", score: 4.1 },
          { metric: "Response Timeliness", score: 4.2 },
          { metric: "Resource Sharing", score: 4.3 },
          { metric: "Feedback Quality", score: 4.2 },
          { metric: "Student Support", score: 4.2 },
        ],
        studentEvaluation: [
          { metric: "Subject Mastery", score: 4.4 },
          { metric: "Student Engagement", score: 4.2 },
          { metric: "Assessment Fairness", score: 4.3 },
          { metric: "Professionalism", score: 4.4 },
          { metric: "Overall Satisfaction", score: 4.3 },
        ],
      }),
    },
    {
      facultySlug: "carlo-bautista",
      facultyName: "Dr. Carlo Bautista",
      facultyInitials: "CB",
      subjects: ["Mobile Development", "Android Programming", "iOS Fundamentals"],
      averageRating: 4.5,
      overallPositiveRate: "87.6%",
      responses: 389,
      quantitativeMetrics: createQuantitativeMetricViews({
        classroom: [
          { metric: "Instructional Clarity", score: 4.6 },
          { metric: "Pacing", score: 4.4 },
          { metric: "Discussion Quality", score: 4.5 },
          { metric: "Classroom Management", score: 4.5 },
          { metric: "Learning Environment", score: 4.5 },
        ],
        outOfClassroom: [
          { metric: "Consultation Availability", score: 4.4 },
          { metric: "Response Timeliness", score: 4.3 },
          { metric: "Resource Sharing", score: 4.5 },
          { metric: "Feedback Quality", score: 4.4 },
          { metric: "Student Support", score: 4.4 },
        ],
        studentEvaluation: [
          { metric: "Subject Mastery", score: 4.6 },
          { metric: "Student Engagement", score: 4.4 },
          { metric: "Assessment Fairness", score: 4.4 },
          { metric: "Professionalism", score: 4.6 },
          { metric: "Overall Satisfaction", score: 4.5 },
        ],
      }),
    },
    {
      facultySlug: "angela-santos",
      facultyName: "Prof. Angela Santos",
      facultyInitials: "AS",
      subjects: ["Information Security", "Ethical Hacking", "Digital Forensics"],
      averageRating: 4.6,
      overallPositiveRate: "89.1%",
      responses: 421,
      quantitativeMetrics: createQuantitativeMetricViews({
        classroom: [
          { metric: "Instructional Clarity", score: 4.7 },
          { metric: "Pacing", score: 4.5 },
          { metric: "Discussion Quality", score: 4.6 },
          { metric: "Classroom Management", score: 4.6 },
          { metric: "Learning Environment", score: 4.7 },
        ],
        outOfClassroom: [
          { metric: "Consultation Availability", score: 4.6 },
          { metric: "Response Timeliness", score: 4.5 },
          { metric: "Resource Sharing", score: 4.6 },
          { metric: "Feedback Quality", score: 4.5 },
          { metric: "Student Support", score: 4.6 },
        ],
        studentEvaluation: [
          { metric: "Subject Mastery", score: 4.8 },
          { metric: "Student Engagement", score: 4.5 },
          { metric: "Assessment Fairness", score: 4.5 },
          { metric: "Professionalism", score: 4.7 },
          { metric: "Overall Satisfaction", score: 4.6 },
        ],
      }),
    },
    {
      facultySlug: "jerome-villanueva",
      facultyName: "Dr. Jerome Villanueva",
      facultyInitials: "JV",
      subjects: ["Cloud Computing", "Distributed Systems", "DevOps Practices"],
      averageRating: 4.9,
      overallPositiveRate: "92.3%",
      responses: 476,
      quantitativeMetrics: createQuantitativeMetricViews({
        classroom: [
          { metric: "Instructional Clarity", score: 4.9 },
          { metric: "Pacing", score: 4.8 },
          { metric: "Discussion Quality", score: 4.9 },
          { metric: "Classroom Management", score: 4.9 },
          { metric: "Learning Environment", score: 4.9 },
        ],
        outOfClassroom: [
          { metric: "Consultation Availability", score: 4.8 },
          { metric: "Response Timeliness", score: 4.9 },
          { metric: "Resource Sharing", score: 4.9 },
          { metric: "Feedback Quality", score: 4.8 },
          { metric: "Student Support", score: 4.9 },
        ],
        studentEvaluation: [
          { metric: "Subject Mastery", score: 5.0 },
          { metric: "Student Engagement", score: 4.8 },
          { metric: "Assessment Fairness", score: 4.8 },
          { metric: "Professionalism", score: 4.9 },
          { metric: "Overall Satisfaction", score: 4.9 },
        ],
      }),
    },
    {
      facultySlug: "hazel-garcia",
      facultyName: "Prof. Hazel Garcia",
      facultyInitials: "HG",
      subjects: ["Business Analytics", "Data Visualization", "Decision Support Systems"],
      averageRating: 4.4,
      overallPositiveRate: "85.8%",
      responses: 365,
      quantitativeMetrics: createQuantitativeMetricViews({
        classroom: [
          { metric: "Instructional Clarity", score: 4.4 },
          { metric: "Pacing", score: 4.3 },
          { metric: "Discussion Quality", score: 4.3 },
          { metric: "Classroom Management", score: 4.4 },
          { metric: "Learning Environment", score: 4.4 },
        ],
        outOfClassroom: [
          { metric: "Consultation Availability", score: 4.2 },
          { metric: "Response Timeliness", score: 4.2 },
          { metric: "Resource Sharing", score: 4.4 },
          { metric: "Feedback Quality", score: 4.2 },
          { metric: "Student Support", score: 4.3 },
        ],
        studentEvaluation: [
          { metric: "Subject Mastery", score: 4.5 },
          { metric: "Student Engagement", score: 4.3 },
          { metric: "Assessment Fairness", score: 4.2 },
          { metric: "Professionalism", score: 4.4 },
          { metric: "Overall Satisfaction", score: 4.4 },
        ],
      }),
    },
    {
      facultySlug: "miguel-aquino",
      facultyName: "Dr. Miguel Aquino",
      facultyInitials: "MA",
      subjects: ["Research Methods", "Thesis Writing", "Capstone Advising"],
      averageRating: 4.6,
      overallPositiveRate: "88.9%",
      responses: 403,
      quantitativeMetrics: createQuantitativeMetricViews({
        classroom: [
          { metric: "Instructional Clarity", score: 4.7 },
          { metric: "Pacing", score: 4.5 },
          { metric: "Discussion Quality", score: 4.6 },
          { metric: "Classroom Management", score: 4.6 },
          { metric: "Learning Environment", score: 4.6 },
        ],
        outOfClassroom: [
          { metric: "Consultation Availability", score: 4.7 },
          { metric: "Response Timeliness", score: 4.6 },
          { metric: "Resource Sharing", score: 4.5 },
          { metric: "Feedback Quality", score: 4.6 },
          { metric: "Student Support", score: 4.7 },
        ],
        studentEvaluation: [
          { metric: "Subject Mastery", score: 4.6 },
          { metric: "Student Engagement", score: 4.5 },
          { metric: "Assessment Fairness", score: 4.6 },
          { metric: "Professionalism", score: 4.7 },
          { metric: "Overall Satisfaction", score: 4.6 },
        ],
      }),
    },
  ],
} as const;

export type DeanFacultyAnalysisRecord =
  (typeof deanAnalyticsSampleData.facultyAnalysis)[number];

export function getDeanFacultyAnalysisBySlug(facultySlug: string) {
  return deanAnalyticsSampleData.facultyAnalysis.find(
    (faculty) => faculty.facultySlug === facultySlug,
  );
}
