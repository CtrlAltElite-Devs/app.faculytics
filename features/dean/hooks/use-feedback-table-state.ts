import { useState } from "react";

import type { DeanFacultyAnalysisRecord } from "@/features/dean";
import { getPaginationItems, paginateArray } from "@/lib/pagination";

const rowsPerPageOptions = [5, 10, 20] as const;
const sentimentFilterOptions = ["All", "Positive", "Neutral", "Negative"] as const;

export type SentimentFilter = (typeof sentimentFilterOptions)[number];

export { rowsPerPageOptions, sentimentFilterOptions };

export function useFeedbackTableState(faculty: DeanFacultyAnalysisRecord) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSentiment, setSelectedSentiment] = useState<SentimentFilter>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(rowsPerPageOptions[0]);

  const filteredFeedback = faculty.feedbackRecords.filter((record) => {
    const matchesSearch = record.feedback
      .toLowerCase()
      .includes(searchQuery.trim().toLowerCase());
    const matchesSentiment =
      selectedSentiment === "All" || record.sentiment === selectedSentiment;

    return matchesSearch && matchesSentiment;
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
