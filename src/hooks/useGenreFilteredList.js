import { useState, useEffect, useRef, useCallback } from "react";

const TMDB_MAX_PAGES = 500;

const useGenreFilteredList = (discoverFn, selectedGenre, genresList) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const abortRef = useRef(null);
  const committedKeyRef = useRef("");
  const totalPagesRef = useRef(0);
  const selectedKey = selectedGenre.join("|");

  useEffect(() => {
    const genreIds = selectedGenre
      .map((name) => genresList.find((g) => g.name === name)?.id)
      .filter(Boolean)
      .join(",");

    const isKeyChange = selectedKey !== committedKeyRef.current;
    if (isKeyChange) {
      abortRef.current?.abort();
      committedKeyRef.current = selectedKey;
      setItems([]);
      setCurrentPage(1);
      setTotalPages(0);
      setTotalResults(0);
    }

    if (!genreIds) {
      if (isKeyChange) setLoading(false);
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);

    const page = isKeyChange ? 1 : currentPage;

    (async () => {
      try {
        const { data } = await discoverFn(
          { page, with_genres: genreIds },
          { signal: controller.signal }
        );
        if (controller.signal.aborted) return;
        setItems(data.results);
        const clamped = Math.min(data.total_pages, TMDB_MAX_PAGES);
        setTotalPages(clamped);
        totalPagesRef.current = clamped;
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
    setCurrentPage(() => {
      if (page < 1) return 1;
      if (totalPagesRef.current > 0 && page > totalPagesRef.current) return totalPagesRef.current;
      return page;
    });
  }, []);

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
