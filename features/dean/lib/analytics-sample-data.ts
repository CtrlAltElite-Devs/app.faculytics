import type {
  FacultyFeedbackRecord,
  QualitativeActionPlan,
  QualitativeInsight,
  QualitativeTheme,
  QuantitativeMetricScore,
} from "@/features/dean/types";

const feedbackTypeCycle = [
  "In Classroom",
  "Out of Classroom",
  "Student Evaluation",
] as const satisfies FacultyFeedbackRecord["type"][];

const defaultFacultyFeedbackRecords: readonly FacultyFeedbackRecord[] = [
  {
    date: "2026-01-14",
    feedback: "Explains difficult concepts clearly and checks if the class is keeping up.",
    sentiment: "Positive",
  },
  {
    date: "2026-01-21",
    feedback: "Provides helpful examples, though some sessions feel a bit fast-paced.",
    sentiment: "Neutral",
  },
  {
    date: "2026-01-28",
    feedback: "Creates a welcoming classroom environment and encourages participation.",
    sentiment: "Positive",
  },
  {
    date: "2026-02-03",
    feedback: "Would appreciate quicker feedback on submitted activities and quizzes.",
    sentiment: "Negative",
  },
  {
    date: "2026-02-10",
    feedback: "Consultation sessions are useful and make course requirements easier to understand.",
    sentiment: "Positive",
  },
  {
    date: "2026-02-18",
    feedback: "Instructions are generally clear, but deadlines should be emphasized more often.",
    sentiment: "Neutral",
  },
  {
    date: "2026-02-24",
    feedback: "Uses practical examples that help connect theory to real-world situations.",
    sentiment: "Positive",
  },
  {
    date: "2026-03-02",
    feedback: "Some lessons move too quickly when multiple topics are covered in one meeting.",
    sentiment: "Negative",
  },
  {
    date: "2026-03-09",
    feedback: "Shows strong command of the subject and answers questions confidently.",
    sentiment: "Positive",
  },
  {
    date: "2026-03-16",
    feedback: "Overall a good learning experience with room for improved follow-up materials.",
    sentiment: "Neutral",
  },
  {
    date: "2026-03-19",
    feedback: "Uses organized slides that make each lecture easier to follow.",
    sentiment: "Positive",
  },
  {
    date: "2026-03-22",
    feedback:
      "Class activities are helpful, but some instructions could be repeated before starting.",
    sentiment: "Neutral",
  },
  {
    date: "2026-03-25",
    feedback: "Needs to return graded outputs sooner so students can adjust their performance.",
    sentiment: "Negative",
  },
  {
    date: "2026-03-28",
    feedback: "Shows patience when answering follow-up questions during recitation.",
    sentiment: "Positive",
  },
  {
    date: "2026-04-02",
    feedback: "Provides useful reminders before major assessments and deadlines.",
    sentiment: "Positive",
  },
  {
    date: "2026-04-05",
    feedback: "Some examples are clear, though a few topics still need more detailed discussion.",
    sentiment: "Neutral",
  },
  {
    date: "2026-04-08",
    feedback: "Consultation hours are helpful, but availability can be inconsistent on busy weeks.",
    sentiment: "Neutral",
  },
  {
    date: "2026-04-11",
    feedback:
      "The instructor encourages participation and makes students feel comfortable sharing ideas.",
    sentiment: "Positive",
  },
  {
    date: "2026-04-14",
    feedback: "Feedback on projects is sometimes too brief to guide improvement well.",
    sentiment: "Negative",
  },
  {
    date: "2026-04-17",
    feedback: "Relates lessons to real scenarios, which helps with understanding complex topics.",
    sentiment: "Positive",
  },
  {
    date: "2026-04-20",
    feedback:
      "The course is manageable overall, but workload expectations should be clarified earlier.",
    sentiment: "Neutral",
  },
  {
    date: "2026-04-23",
    feedback: "Creates a respectful class atmosphere and handles discussions professionally.",
    sentiment: "Positive",
  },
  {
    date: "2026-04-26",
    feedback:
      "Lecture pacing becomes difficult to follow when several new concepts are introduced together.",
    sentiment: "Negative",
  },
  {
    date: "2026-04-29",
    feedback: "Instructions for laboratory tasks are detailed and easy to apply.",
    sentiment: "Positive",
  },
  {
    date: "2026-05-02",
    feedback:
      "Shows expertise in the subject, although some answers could be explained more simply.",
    sentiment: "Neutral",
  },
  {
    date: "2026-05-05",
    feedback: "Uses examples from actual practice, which makes the subject more engaging.",
    sentiment: "Positive",
  },
  {
    date: "2026-05-08",
    feedback: "Would benefit from posting materials earlier before class sessions.",
    sentiment: "Negative",
  },
  {
    date: "2026-05-11",
    feedback: "Makes effort to check student understanding before moving to the next topic.",
    sentiment: "Positive",
  },
  {
    date: "2026-05-14",
    feedback:
      "Assessment instructions are generally clear, but rubrics should be discussed more fully.",
    sentiment: "Neutral",
  },
  {
    date: "2026-05-17",
    feedback: "Overall, the class is well handled and supports steady learning progress.",
    sentiment: "Positive",
  },
].map((record, index) => ({
  ...record,
  type: feedbackTypeCycle[index % feedbackTypeCycle.length],
})) as const;

function createQualitativeSemesterData(
  positive: number,
  neutral: number,
  negative: number,
  themes: QualitativeTheme[],
  strengthsToMaintain: QualitativeInsight[],
  areasForImprovement: QualitativeInsight[],
  actionPlans: {
    strengthsToMaintain: QualitativeActionPlan[];
    areasForImprovement: QualitativeActionPlan[];
  }
) {
  const normalizedThemes = [...themes];

  while (normalizedThemes.length < 5) {
    normalizedThemes.push({
      label: `Additional theme ${normalizedThemes.length + 1}`,
      mentions: Math.max(12 - normalizedThemes.length, 4),
    });
  }

  return {
    sentiment: [
      { label: "Positive", value: positive, color: "#5b8cff" },
      { label: "Neutral", value: neutral, color: "#d1d5db" },
      { label: "Negative", value: negative, color: "#facc15" },
    ],
    keyThemes: normalizedThemes,
    strengthsToMaintain,
    areasForImprovement,
    actionPlans,
  };
}

function createQualitativeMetrics(
  firstSemester: ReturnType<typeof createQualitativeSemesterData>,
  secondSemester: ReturnType<typeof createQualitativeSemesterData>,
  summerSemester: ReturnType<typeof createQualitativeSemesterData>
) {
  return {
    firstSemester,
    secondSemester,
    summerSemester,
  };
}

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
      questions: createMetricQuestions(
        score,
        quantitativeQuestionnaireTemplates[
          metric as keyof typeof quantitativeQuestionnaireTemplates
        ]
      ),
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

const defaultQualitativeMetrics = createQualitativeMetrics(
  createQualitativeSemesterData(
    84,
    9,
    7,
    [
      { label: "Clear explanations", mentions: 48 },
      { label: "Approachable attitude", mentions: 39 },
      { label: "Organized teaching", mentions: 34 },
      { label: "Helpful feedback", mentions: 28 },
    ],
    [
      {
        title: "Clear and Structured Explanations",
        description:
          "Students consistently recognize the instructor's ability to explain lessons clearly and organize topics well.",
      },
      {
        title: "Approachable Classroom Presence",
        description:
          "Students value the welcoming and student-friendly attitude maintained during classes and consultations.",
      },
    ],
    [
      {
        title: "Feedback Turnaround",
        description:
          "Written feedback on outputs can be released more consistently and within a shorter response window.",
      },
      {
        title: "Active Learning Variety",
        description:
          "Longer sessions would benefit from more interactive activities to sustain participation and energy.",
      },
    ],
    {
      strengthsToMaintain: [
        {
          title: "Action Plan for Clear and Structured Explanations",
          items: [
            "Preserve the current lesson-planning structure and use it as the default teaching format.",
            "Document best-performing classroom practices that students consistently mention positively.",
          ],
        },
        {
          title: "Action Plan for Approachable Classroom Presence",
          items: [
            "Keep consultation channels welcoming and predictable for students.",
            "Continue modeling a calm and student-friendly classroom tone across all sessions.",
          ],
        },
      ],
      areasForImprovement: [
        {
          title: "Action Plan for Feedback Turnaround",
          items: [
            "Set a weekly turnaround target for graded activities and consultation replies.",
            "Block dedicated review time after each assessment to avoid feedback backlogs.",
          ],
        },
        {
          title: "Action Plan for Active Learning Variety",
          items: [
            "Introduce one interactive activity or discussion prompt in every major session.",
            "Rotate quick collaborative exercises to maintain engagement during longer classes.",
          ],
        },
      ],
    }
  ),
  createQualitativeSemesterData(
    88,
    6,
    6,
    [
      { label: "Engaging delivery", mentions: 52 },
      { label: "Responsive guidance", mentions: 41 },
      { label: "Supportive environment", mentions: 36 },
      { label: "Fair assessment", mentions: 30 },
    ],
    [
      {
        title: "Engaging Lecture Delivery",
        description:
          "Students respond well to the energetic and engaging delivery style used during class discussions.",
      },
      {
        title: "Responsive Academic Guidance",
        description:
          "Consultation support remains a strong point and contributes to student confidence and progress.",
      },
    ],
    [
      {
        title: "Follow-up Learning Resources",
        description:
          "Students would benefit from more consistent posting of recap materials and follow-up references.",
      },
      {
        title: "Assessment Alignment",
        description:
          "Examples used in class can be aligned more directly with assessment formats and expectations.",
      },
    ],
    {
      strengthsToMaintain: [
        {
          title: "Action Plan for Engaging Lecture Delivery",
          items: [
            "Retain the current discussion-led teaching moments that students identify as engaging.",
            "Continue using dynamic facilitation during major content discussions.",
          ],
        },
        {
          title: "Action Plan for Responsive Academic Guidance",
          items: [
            "Keep consultation channels open and preserve current response habits.",
            "Maintain scheduled checkpoints for students who need additional support.",
          ],
        },
      ],
      areasForImprovement: [
        {
          title: "Action Plan for Follow-up Learning Resources",
          items: [
            "Publish a short resource recap after each major lesson or module.",
            "Standardize post-class uploads so students know where to find follow-up materials.",
          ],
        },
        {
          title: "Action Plan for Assessment Alignment",
          items: [
            "Review quiz and activity examples at the end of each week to ensure assessment alignment.",
            "Add a short assessment preview before graded tasks are released.",
          ],
        },
      ],
    }
  ),
  createQualitativeSemesterData(
    76,
    12,
    12,
    [
      { label: "Condensed lessons", mentions: 26 },
      { label: "Flexible pacing", mentions: 22 },
      { label: "Practical exercises", mentions: 19 },
      { label: "Schedule clarity", mentions: 17 },
    ],
    [
      {
        title: "Flexible Session Delivery",
        description:
          "Students appreciate the adaptable handling of shortened summer-term sessions.",
      },
      {
        title: "Practical Exercises",
        description:
          "Hands-on activities remain useful in helping students stay engaged during the compressed term.",
      },
    ],
    [
      {
        title: "Schedule Communication",
        description:
          "Students need clearer reminders and visibility for deadlines during the faster summer cycle.",
      },
      {
        title: "Resource Availability",
        description:
          "More centralized access to materials would help students keep pace in the summer term.",
      },
    ],
    {
      strengthsToMaintain: [
        {
          title: "Action Plan for Flexible Session Delivery",
          items: [
            "Retain the current adaptive pacing approach for condensed summer classes.",
            "Continue clarifying priorities when sessions need to cover dense material quickly.",
          ],
        },
        {
          title: "Action Plan for Practical Exercises",
          items: [
            "Keep hands-on activities in the summer course flow.",
            "Use short applied exercises to reinforce key topics in limited class time.",
          ],
        },
      ],
      areasForImprovement: [
        {
          title: "Action Plan for Schedule Communication",
          items: [
            "Post weekly deadline summaries to improve visibility in the compressed term.",
            "Send reminder updates before major summer deliverables are due.",
          ],
        },
        {
          title: "Action Plan for Resource Availability",
          items: [
            "Organize summer-term learning materials in one consistent location.",
            "Upload recap materials immediately after each major session.",
          ],
        },
      ],
    }
  )
);

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
    {
      sentiment: "Positive",
      firstSemester: 84,
      secondSemester: 88,
      summerSemester: 72,
    },
    {
      sentiment: "Negative",
      firstSemester: 9,
      secondSemester: 6,
      summerSemester: 14,
    },
    {
      sentiment: "Neutral",
      firstSemester: 7,
      secondSemester: 6,
      summerSemester: 14,
    },
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
      subjects: ["Data Structures", "Algorithms", "Discrete Mathematics", "Automata Theory"],
      averageRating: 4.7,
      overallPositiveRate: "89.4%",
      responses: 412,
      feedbackRecords: defaultFacultyFeedbackRecords,
      quantitativeMetrics: defaultQuantitativeMetricViews,
      qualitativeMetrics: defaultQualitativeMetrics,
    },
    {
      facultySlug: "marcus-dela-cruz",
      facultyName: "Prof. Marcus Dela Cruz",
      facultyInitials: "MC",
      subjects: ["Operating Systems", "Computer Networks", "Cybersecurity"],
      averageRating: 4.4,
      overallPositiveRate: "85.1%",
      responses: 376,
      feedbackRecords: defaultFacultyFeedbackRecords,
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
      qualitativeMetrics: createQualitativeMetrics(
        createQualitativeSemesterData(
          79,
          11,
          10,
          [
            { label: "Strong subject knowledge", mentions: 33 },
            { label: "Needs faster feedback", mentions: 24 },
            { label: "Practical examples", mentions: 21 },
            { label: "Better pacing", mentions: 18 },
          ],
          [
            {
              title: "Strong Subject Expertise",
              description:
                "Students consistently note the instructor's strong command of technical content.",
            },
            {
              title: "Practical Examples",
              description:
                "Real-world examples help students connect concepts to applied scenarios.",
            },
          ],
          [
            {
              title: "Feedback Turnaround",
              description: "Students want faster feedback on assignments and graded activities.",
            },
            {
              title: "Lesson Pacing",
              description:
                "Lesson pacing can be adjusted to better support different student learning speeds.",
            },
          ],
          {
            strengthsToMaintain: [
              {
                title: "Action Plan for Strong Subject Expertise",
                items: [
                  "Preserve depth and accuracy in explanation of core concepts.",
                  "Keep preparing subject matter examples that demonstrate expertise clearly.",
                ],
              },
              {
                title: "Action Plan for Practical Examples",
                items: [
                  "Continue integrating practical examples in technical lessons.",
                  "Collect more applied case examples from recent industry scenarios.",
                ],
              },
            ],
            areasForImprovement: [
              {
                title: "Action Plan for Feedback Turnaround",
                items: [
                  "Commit to a defined feedback release timeline for each graded task.",
                  "Set aside a recurring grading block after every major submission.",
                ],
              },
              {
                title: "Action Plan for Lesson Pacing",
                items: [
                  "Add periodic comprehension checks to calibrate lesson pacing.",
                  "Use short pauses and recap questions before moving to the next concept.",
                ],
              },
            ],
          }
        ),
        createQualitativeSemesterData(
          83,
          9,
          8,
          [
            { label: "Better class flow", mentions: 35 },
            { label: "Clearer instructions", mentions: 27 },
            { label: "Accessible consultations", mentions: 23 },
            { label: "Useful materials", mentions: 20 },
          ],
          [
            {
              title: "Improved Class Flow",
              description:
                "Students recognize the stronger structure and smoother sequencing of lessons.",
            },
            {
              title: "Accessible Consultations",
              description:
                "Students appreciate the improved accessibility of consultations and support.",
            },
          ],
          [
            {
              title: "Instruction Clarity",
              description:
                "Assignment and project instructions can still be made more explicit and standardized.",
            },
            {
              title: "Supplementary Materials",
              description:
                "Students want a broader set of supporting materials for review and independent study.",
            },
          ],
          {
            strengthsToMaintain: [
              {
                title: "Action Plan for Improved Class Flow",
                items: [
                  "Keep the revised lesson flow and consultation schedule in the next term.",
                  "Document the current session sequence as a repeatable teaching template.",
                ],
              },
              {
                title: "Action Plan for Accessible Consultations",
                items: [
                  "Maintain the current consultation structure and communication channels.",
                  "Continue publicizing available consultation times at the start of each module.",
                ],
              },
            ],
            areasForImprovement: [
              {
                title: "Action Plan for Instruction Clarity",
                items: [
                  "Use a standard instruction template for projects and graded exercises.",
                  "Add a checklist section to reduce ambiguity in activity instructions.",
                ],
              },
              {
                title: "Action Plan for Supplementary Materials",
                items: [
                  "Prepare a weekly resource pack for review and extension work.",
                  "Organize materials by topic so students can revisit them more easily.",
                ],
              },
            ],
          }
        ),
        defaultQualitativeMetrics.summerSemester
      ),
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
      feedbackRecords: defaultFacultyFeedbackRecords,
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
      qualitativeMetrics: createQualitativeMetrics(
        createQualitativeSemesterData(
          90,
          6,
          4,
          [
            { label: "Excellent mentoring", mentions: 56 },
            { label: "Interactive sessions", mentions: 49 },
            { label: "Thoughtful feedback", mentions: 41 },
            { label: "Well-structured lessons", mentions: 38 },
          ],
          [
            {
              title: "High-Quality Mentoring",
              description:
                "Students consistently value the mentoring and support provided throughout the term.",
            },
            {
              title: "Interactive Session Structure",
              description:
                "The class format successfully keeps students involved and attentive during sessions.",
            },
          ],
          [
            {
              title: "Consultation Follow-through",
              description:
                "Students would benefit from clearer written follow-through after major consultation sessions.",
            },
            {
              title: "Assessment Visibility",
              description:
                "Assessment expectations can be surfaced earlier and more explicitly in each module.",
            },
          ],
          {
            strengthsToMaintain: [
              {
                title: "Action Plan for High-Quality Mentoring",
                items: [
                  "Continue one-on-one mentoring touchpoints for students handling major projects.",
                  "Preserve current support structures for students who need extra guidance.",
                ],
              },
              {
                title: "Action Plan for Interactive Session Structure",
                items: [
                  "Preserve interactive teaching patterns that drive participation.",
                  "Keep discussion prompts and workshop-style learning moments in regular use.",
                ],
              },
            ],
            areasForImprovement: [
              {
                title: "Action Plan for Consultation Follow-through",
                items: [
                  "Send short follow-up notes after major advising or mentoring discussions.",
                  "Create a simple consultation summary template for recurring use.",
                ],
              },
              {
                title: "Action Plan for Assessment Visibility",
                items: [
                  "Present assessment expectations in the first week of each module.",
                  "Add a visible rubric or scoring guide before major outputs begin.",
                ],
              },
            ],
          }
        ),
        createQualitativeSemesterData(
          93,
          4,
          3,
          [
            { label: "Outstanding facilitation", mentions: 61 },
            { label: "Very supportive", mentions: 46 },
            { label: "Real-world examples", mentions: 43 },
            { label: "Clear expectations", mentions: 39 },
          ],
          [
            {
              title: "Outstanding Facilitation",
              description:
                "Students consistently describe the facilitation style as highly effective and supportive.",
            },
            {
              title: "Real-world Examples",
              description:
                "Applied examples remain a major strength in helping students understand the material.",
            },
          ],
          [
            {
              title: "Reusable Session Materials",
              description:
                "Students would benefit from easier access to materials after live sessions conclude.",
            },
            {
              title: "Project Progress Checkpoints",
              description:
                "More formal milestone reviews can improve progress visibility during longer projects.",
            },
          ],
          {
            strengthsToMaintain: [
              {
                title: "Action Plan for Outstanding Facilitation",
                items: [
                  "Retain the current facilitation model and applied-example approach.",
                  "Share proven engagement practices with the wider department.",
                ],
              },
              {
                title: "Action Plan for Real-world Examples",
                items: [
                  "Continue mapping concepts to real-world scenarios and case examples.",
                  "Refresh applied examples each term to keep them timely and relevant.",
                ],
              },
            ],
            areasForImprovement: [
              {
                title: "Action Plan for Reusable Session Materials",
                items: [
                  "Upload summary resources immediately after major sessions.",
                  "Create a central repository for reusable lesson references and recap files.",
                ],
              },
              {
                title: "Action Plan for Project Progress Checkpoints",
                items: [
                  "Introduce milestone reviews for project-based outputs.",
                  "Set checkpoint reminders and status reviews at fixed intervals.",
                ],
              },
            ],
          }
        ),
        defaultQualitativeMetrics.summerSemester
      ),
    },
    {
      facultySlug: "ethan-navarro",
      facultyName: "Dr. Ethan Navarro",
      facultyInitials: "EN",
      subjects: ["Database Systems", "Data Warehousing", "SQL Programming"],
      averageRating: 4.5,
      overallPositiveRate: "88.2%",
      responses: 441,
      feedbackRecords: defaultFacultyFeedbackRecords,
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
      qualitativeMetrics: defaultQualitativeMetrics,
    },
    {
      facultySlug: "liza-fernandez",
      facultyName: "Prof. Liza Fernandez",
      facultyInitials: "LF",
      subjects: ["Web Development", "UI Design", "Frontend Frameworks", "Accessibility"],
      averageRating: 4.4,
      overallPositiveRate: "86.7%",
      responses: 394,
      feedbackRecords: defaultFacultyFeedbackRecords,
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
      qualitativeMetrics: defaultQualitativeMetrics,
    },
    {
      facultySlug: "paolo-ramirez",
      facultyName: "Dr. Paolo Ramirez",
      facultyInitials: "PR",
      subjects: ["Artificial Intelligence", "Machine Learning", "Deep Learning"],
      averageRating: 4.7,
      overallPositiveRate: "90.5%",
      responses: 467,
      feedbackRecords: defaultFacultyFeedbackRecords,
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
      qualitativeMetrics: defaultQualitativeMetrics,
    },
    {
      facultySlug: "nina-torres",
      facultyName: "Prof. Nina Torres",
      facultyInitials: "NT",
      subjects: ["Project Management", "IT Governance", "Enterprise Systems"],
      averageRating: 4.3,
      overallPositiveRate: "84.9%",
      responses: 352,
      feedbackRecords: defaultFacultyFeedbackRecords,
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
      qualitativeMetrics: defaultQualitativeMetrics,
    },
    {
      facultySlug: "carlo-bautista",
      facultyName: "Dr. Carlo Bautista",
      facultyInitials: "CB",
      subjects: ["Mobile Development", "Android Programming", "iOS Fundamentals"],
      averageRating: 4.5,
      overallPositiveRate: "87.6%",
      responses: 389,
      feedbackRecords: defaultFacultyFeedbackRecords,
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
      qualitativeMetrics: defaultQualitativeMetrics,
    },
    {
      facultySlug: "angela-santos",
      facultyName: "Prof. Angela Santos",
      facultyInitials: "AS",
      subjects: ["Information Security", "Ethical Hacking", "Digital Forensics"],
      averageRating: 4.6,
      overallPositiveRate: "89.1%",
      responses: 421,
      feedbackRecords: defaultFacultyFeedbackRecords,
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
      qualitativeMetrics: defaultQualitativeMetrics,
    },
    {
      facultySlug: "jerome-villanueva",
      facultyName: "Dr. Jerome Villanueva",
      facultyInitials: "JV",
      subjects: ["Cloud Computing", "Distributed Systems", "DevOps Practices"],
      averageRating: 4.9,
      overallPositiveRate: "92.3%",
      responses: 476,
      feedbackRecords: defaultFacultyFeedbackRecords,
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
      qualitativeMetrics: defaultQualitativeMetrics,
    },
    {
      facultySlug: "hazel-garcia",
      facultyName: "Prof. Hazel Garcia",
      facultyInitials: "HG",
      subjects: ["Business Analytics", "Data Visualization", "Decision Support Systems"],
      averageRating: 4.4,
      overallPositiveRate: "85.8%",
      responses: 365,
      feedbackRecords: defaultFacultyFeedbackRecords,
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
      qualitativeMetrics: defaultQualitativeMetrics,
    },
    {
      facultySlug: "miguel-aquino",
      facultyName: "Dr. Miguel Aquino",
      facultyInitials: "MA",
      subjects: ["Research Methods", "Thesis Writing", "Capstone Advising"],
      averageRating: 4.6,
      overallPositiveRate: "88.9%",
      responses: 403,
      feedbackRecords: defaultFacultyFeedbackRecords,
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
      qualitativeMetrics: defaultQualitativeMetrics,
    },
  ],
} as const;

export type DeanFacultyAnalysisRecord = (typeof deanAnalyticsSampleData.facultyAnalysis)[number];

export function getDeanFacultyAnalysisBySlug(facultySlug: string) {
  return deanAnalyticsSampleData.facultyAnalysis.find(
    (faculty) => faculty.facultySlug === facultySlug
  );
}
