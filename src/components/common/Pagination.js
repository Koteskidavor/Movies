import { memo, useMemo } from "react";
import "./Pagination.css";

const PAGE_SIZE = 20;
const TMDB_MAX_PAGES = 500;

function getPageWindow(currentPage, totalPages, delta = 2) {
  const pages = [];
  const left = Math.max(2, currentPage - delta);
  const right = Math.min(totalPages - 1, currentPage + delta);

  for (let i = left; i <= right; i++) {
    pages.push(i);
  }

  const withEdges = [];
  if (left > 2) {
    withEdges.push(1, "...");
  } else {
    withEdges.push(1);
  }
  withEdges.push(...pages);
  if (right < totalPages - 1) {
    withEdges.push("...", totalPages);
  } else if (totalPages > 1) {
    withEdges.push(totalPages);
  }

  return withEdges;
}

const Pagination = ({
  currentPage,
  totalPages,
  totalResults,
  onPageChange,
  pageSize = PAGE_SIZE,
  itemLabel = "movies",
}) => {
  const caps = useMemo(() => {
    const cappedTotalPages = Math.min(totalPages, TMDB_MAX_PAGES);
    const cappedTotalResults = Math.min(totalResults, cappedTotalPages * pageSize);
    const start = (currentPage - 1) * pageSize + 1;
    const end = Math.min(currentPage * pageSize, cappedTotalResults);
    const pageNumbers =
      cappedTotalPages > 1 ? getPageWindow(currentPage, cappedTotalPages) : [];
    return { cappedTotalPages, cappedTotalResults, start, end, pageNumbers };
  }, [currentPage, totalPages, totalResults, pageSize]);

  if (!totalResults || totalResults === 0) return null;

  const { cappedTotalPages, cappedTotalResults, start, end, pageNumbers } = caps;

  return (
    <div className="pagination">
      <div className="pagination-info">
        <strong>
          {start}-{end}
        </strong>{" "}
        of <strong>{cappedTotalResults.toLocaleString()}</strong> {itemLabel}
      </div>
      {cappedTotalPages > 1 && (
        <div className="pagination-controls">
          <button
            className="pagination-btn"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            aria-label="Previous page"
          >
            ‹ Prev
          </button>
          {pageNumbers.map((p, idx) =>
            p === "..." ? (
              <span key={`dots-${idx}`} className="pagination-dots">
                …
              </span>
            ) : (
              <button
                key={p}
                className={`pagination-btn ${p === currentPage ? "pagination-active" : ""
                  }`}
                onClick={() => onPageChange(p)}
                aria-label={`Go to page ${p}`}
                aria-current={p === currentPage ? "page" : undefined}
              >
                {p}
              </button>
            )
          )}
          <button
            className="pagination-btn"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= cappedTotalPages}
            aria-label="Next page"
          >
            Next ›
          </button>
        </div>
      )}
    </div>
  );
};

export default memo(Pagination);
