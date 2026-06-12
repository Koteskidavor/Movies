import { memo, useState, useEffect, useCallback } from "react";
import MediaCard from "./MediaCard";
import GenreFilter from "./GenreFilter";
import Spinner from "./Spinner";
import useGenreFilteredList from "../../hooks/useGenreFilteredList";
import useModalRouter from "../../hooks/useModalRouter";
import Pagination from "./Pagination";
import MediaModal from "./MediaModal";
import ErrorBoundary from "./ErrorBoundary";
import "./MediaListPage.css";

const MediaListPage = ({ fetchFn, discoverFn, genres, pageTitle, itemLabel, mediaType }) => {
  const [items, setItems] = useState([]);
  const [defaultPage, setDefaultPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [selectedGenre, setSelectedGenre] = useState([]);
  const [defaultLoading, setDefaultLoading] = useState(false);

  const {
    items: genreItems,
    loading: genreLoading,
    currentPage: genreCurrentPage,
    totalPages: genreTotalPages,
    totalResults: genreTotalResults,
    isActive: genreActive,
    setPage: setGenrePage,
  } = useGenreFilteredList(discoverFn, selectedGenre, genres);

  const { selectedItem, openModal, closeModal } = useModalRouter(mediaType);

  useEffect(() => {
    if (genreActive) return;
    let cancelled = false;
    setDefaultLoading(true);
    (async () => {
      try {
        const { data } = await fetchFn(defaultPage);
        if (cancelled) return;
        setItems(data.results);
        setTotalPages(Math.min(data.total_pages, 500));
        setTotalResults(data.total_results);
      } catch (err) {
        if (!cancelled) console.error("Error: ", err);
      } finally {
        if (!cancelled) setDefaultLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [defaultPage, genreActive, fetchFn]);

  const handleGenreClick = (genreName) => {
    if (!selectedGenre.includes(genreName)) {
      setSelectedGenre([...selectedGenre, genreName]);
    }
  };

  const handleGenreCloseClick = (genreName) => {
    setSelectedGenre(selectedGenre.filter((g) => g !== genreName));
  };

  useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);

  const renderCard = useCallback((item) => (
    <MediaCard key={item.id} item={item} genres={genres} mediaType={mediaType} onClick={openModal} />
  ), [genres, mediaType, openModal]);

  return (
    <ErrorBoundary name="page-content" title="Failed to load content" message="Something went wrong while loading this page. Try refreshing.">
      <div>
        <div className="page-nav">
          <h1 style={{ marginLeft: "20px" }}>{pageTitle}</h1>
        </div>

        <GenreFilter
          genres={genres}
          selectedGenre={selectedGenre}
          onGenreClick={handleGenreClick}
          onGenreCloseClick={handleGenreCloseClick}
        />
        {genreActive ? (
          <>
            <div className="media-container">
              {genreLoading && genreItems.length === 0 ? (
                <div className="genre-loading"><Spinner /> Loading {selectedGenre.join(", ")}...</div>
              ) : (
                genreItems.map((item) => renderCard(item))
              )}
            </div>
            <Pagination
              currentPage={genreCurrentPage}
              totalPages={genreTotalPages}
              totalResults={genreTotalResults}
              onPageChange={setGenrePage}
              itemLabel={`${selectedGenre.join(", ")} ${itemLabel}`}
            />
          </>
        ) : (
          <>
            <div className="media-container">
              {defaultLoading && items.length === 0 ? (
                <div className="genre-loading"><Spinner /> Loading...</div>
              ) : (
                items.map((item) => renderCard(item))
              )}
            </div>
            <Pagination
              currentPage={defaultPage}
              totalPages={totalPages}
              totalResults={totalResults}
              onPageChange={setDefaultPage}
              itemLabel={itemLabel}
            />
          </>
        )}

        {selectedItem && (
          <MediaModal item={selectedItem} mediaType={mediaType} onClose={closeModal} />
        )}
      </div>
    </ErrorBoundary>
  );
};

export default memo(MediaListPage);
