import { useState } from "react";

import type { DeanFacultyAnalysisRecord } from "@/features/faculty-analytics";
import { getPaginationItems, paginateArray } from "@/lib/pagination";

const rowsPerPageOptions = [5, 10, 20] as const;
const sentimentFilterOptions = ["All Sentiments", "Positive", "Neutral", "Negative"] as const;
const typeFilterOptions = [
  "All Types",
  "In Classroom",
  "Out of Classroom",
  "Student Evaluation",
] as const;

export type SentimentFilter = (typeof sentimentFilterOptions)[number];
export type FeedbackTypeFilter = (typeof typeFilterOptions)[number];

export { rowsPerPageOptions, sentimentFilterOptions, typeFilterOptions };

export function useFeedbackTableState(faculty: DeanFacultyAnalysisRecord) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSentiment, setSelectedSentiment] = useState<SentimentFilter>("All Sentiments");
  const [selectedType, setSelectedType] = useState<FeedbackTypeFilter>("All Types");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(rowsPerPageOptions[0]);

  const filteredFeedback = faculty.feedbackRecords.filter((record) => {
    const matchesSearch = record.feedback.toLowerCase().includes(searchQuery.trim().toLowerCase());
    const matchesSentiment =
      selectedSentiment === "All Sentiments" || record.sentiment === selectedSentiment;
    const matchesType = selectedType === "All Types" || record.type === selectedType;

    return matchesSearch && matchesSentiment && matchesType;
  });

  const totalRows = filteredFeedback.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / rowsPerPage));
  const paginatedFeedback = paginateArray(filteredFeedback, currentPage, rowsPerPage);
  const paginationItems = getPaginationItems(currentPage, totalPages);

  return {
    searchQuery,
    setSearchQuery,
    selectedSentiment,
    setSelectedSentiment,
    selectedType,
    setSelectedType,
    currentPage,
    setCurrentPage,
    rowsPerPage,
    setRowsPerPage,
    filteredFeedback,
    totalRows,
    totalPages,
    paginatedFeedback,
    paginationItems,
  };
}
