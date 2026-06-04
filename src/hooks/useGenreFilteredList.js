import { useState, useEffect, useRef, useCallback } from "react";

const useGenreFilteredList = (discoverFn, selectedGenre, genresList) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const abortRef = useRef(null);
  const selectedKey = selectedGenre.join("|");

  useEffect(() => {
    abortRef.current?.abort();
    setItems([]);
    setCurrentPage(1);
    setTotalPages(0);
    setTotalResults(0);
    setLoading(false);

    if (selectedGenre.length === 0) return undefined;

    const genreIds = selectedGenre
      .map((name) => genresList.find((g) => g.name === name)?.id)
      .filter(Boolean)
      .join(",");

    if (!genreIds) return undefined;

    return undefined;
  }, [selectedKey, genresList, selectedGenre]);

  useEffect(() => {
    if (selectedGenre.length === 0) return undefined;

    const genreIds = selectedGenre
      .map((name) => genresList.find((g) => g.name === name)?.id)
      .filter(Boolean)
      .join(",");

    if (!genreIds) return undefined;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);

    (async () => {
      try {
        const { data } = await discoverFn(
          { page: currentPage, with_genres: genreIds },
          { signal: controller.signal }
        );
        if (controller.signal.aborted) return;
        setItems(data.results);
        setTotalPages(data.total_pages);
        setTotalResults(data.total_results);
        setLoading(false);
      } catch (err) {
        if (
          !controller.signal.aborted &&
          err?.name !== "CanceledError" &&
          err?.code !== "ERR_CANCELED"
        ) {
          console.error("useGenreFilteredList error:", err);
          setLoading(false);
        }
      }
    })();

    return () => controller.abort();
  }, [selectedKey, currentPage, discoverFn, selectedGenre, genresList]);

  const goToPage = useCallback((page) => {
    setCurrentPage((prev) => {
      if (page < 1) return 1;
      if (totalPages > 0 && page > totalPages) return totalPages;
      return page;
    });
  }, [totalPages]);

  return {
    items,
    loading,
    currentPage,
    totalPages,
    totalResults,
    isActive: selectedGenre.length > 0,
    setPage: goToPage,
  };
};

export default useGenreFilteredList;
