import { useState, useEffect, useRef, useCallback } from "react";
import MovieInfo from "./MovieInfo";
import { getTopRatedMovies, discoverMovies, getImageUrl } from "../api/tmdb";
import useGenreFilteredList from "../hooks/useGenreFilteredList";
import Pagination from "./Pagination";

const genres = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 14, name: "Fantasy" },
  { id: 36, name: "History" },
  { id: 27, name: "Horror" },
  { id: 10402, name: "Music" },
  { id: 9648, name: "Mystery" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Science Fiction" },
  { id: 10770, name: "TV Movie" },
  { id: 53, name: "Thriller" },
  { id: 10752, name: "War" },
  { id: 37, name: "Western" },
];

const TopRatedMovies = () => {
  const [topRMovies, setTopRMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalMovies, setTotalMovies] = useState(0);
  const [selectedGenre, setSelectedGenre] = useState([]);
  const [defaultLoading, setDefaultLoading] = useState(false);
  const previousStateRef = useRef(null);

  const {
    items: genreItems,
    loading: genreLoading,
    currentPage: genreCurrentPage,
    totalPages: genreTotalPages,
    totalResults: genreTotalResults,
    isActive: genreActive,
    setPage: setGenrePage,
  } = useGenreFilteredList(discoverMovies, selectedGenre, genres);

  useEffect(() => {
    if (!genreActive && previousStateRef.current !== null) {
      const snapshot = previousStateRef.current;
      previousStateRef.current = null;
      setTopRMovies(snapshot.movies);
      setCurrentPage(snapshot.currentPage);
      setTotalPages(snapshot.totalPages);
      setTotalMovies(snapshot.totalMovies);
    }
  }, [genreActive]);

  useEffect(() => {
    if (genreActive && previousStateRef.current === null) {
      previousStateRef.current = {
        movies: topRMovies,
        currentPage,
        totalPages,
        totalMovies,
      };
    }
  }, [genreActive, topRMovies, currentPage, totalPages, totalMovies]);

  useEffect(() => {
    if (genreActive) return;
    let cancelled = false;
    setDefaultLoading(true);
    (async () => {
      try {
        const { data } = await getTopRatedMovies(currentPage);
        if (cancelled) return;
        setTopRMovies(data.results);
        setTotalPages(data.total_pages);
        setTotalMovies(data.total_results);
      } catch (error) {
        if (!cancelled) console.log("Error: ", error);
      } finally {
        if (!cancelled) setDefaultLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [currentPage, genreActive]);

  const handleGenreClick = (genreName) => {
    if (!selectedGenre.includes(genreName)) {
      setSelectedGenre([...selectedGenre, genreName]);
    }
  };
  const handleGenreCloseClick = (genreName) => {
    setSelectedGenre(selectedGenre.filter((genre) => genre !== genreName));
  };

  function getStrokeColor(percentage) {
    if (percentage > 70) return "#63ad6c";
    if (percentage > 50) return "#bdb564";
    return "#e04146";
  }

  function getGenreName(genreId) {
    const genre = genres.find((g) => g.id === genreId);
    return genre ? genre.name : "Unknown";
  }

  function formatReleaseDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const formattedDay = day < 10 ? `${day}` : day;
    const formattedMonth = month < 10 ? `${month}` : month;
    return `${formattedDay}-${formattedMonth}-${year}`;
  }

  const renderMovieCard = useCallback(
    (movie) => {
      const percentage = movie.vote_average * 10;
      const strokeColor = getStrokeColor(percentage);
      const genreNames = movie.genre_ids.map(getGenreName);
      return (
        <div key={movie.id} className="movie-card">
          <img
            src={getImageUrl(movie.poster_path)}
            alt={movie.title}
            style={{ width: "200px" }}
          />
          <div className="rating-container">
            <svg viewBox="0 0 100 100" width="50" height="50">
              <circle cx="50" cy="50" r="45" fill="#e0e0e0" />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                strokeWidth="10"
                stroke={strokeColor}
                strokeDasharray={`${percentage * 2.83}, 283`}
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="rating-text">{percentage.toFixed(0)}%</div>
          </div>
          <MovieInfo
            title={movie.title}
            genreNames={genreNames}
            formatReleaseDate={formatReleaseDate(movie.release_date)}
          />
        </div>
      );
    },
    []
  );

  const showGenreView = genreActive;

  return (
    <div>
      <div className="genre-filter">
        {genres.map((genre) => (
          <div
            key={genre.id}
            className={`genre-item ${selectedGenre.includes(genre.name) ? "selected" : ""
              }`}
          >
            <span onClick={() => handleGenreClick(genre.name)}>
              {genre.name}
            </span>
            {selectedGenre.includes(genre.name) && (
              <span
                className="close-icon"
                onClick={() => handleGenreCloseClick(genre.name)}
              >
                &#x2715;
              </span>
            )}
          </div>
        ))}
      </div>

      {showGenreView && (
        <>
          <div className="movie-container">
            {genreLoading && genreItems.length === 0 ? (
              <div className="genre-loading">
                Loading {selectedGenre.join(", ")}...
              </div>
            ) : (
              genreItems.map((movie) => renderMovieCard(movie))
            )}
          </div>
          <Pagination
            currentPage={genreCurrentPage}
            totalPages={genreTotalPages}
            totalResults={genreTotalResults}
            onPageChange={setGenrePage}
            itemLabel={`${selectedGenre.join(", ")} movies`}
          />
        </>
      )}

      {!showGenreView && (
        <>
          <div className="movie-container">
            {defaultLoading && topRMovies.length === 0 ? (
              <div className="genre-loading">Loading...</div>
            ) : (
              topRMovies.map((movie) => renderMovieCard(movie))
            )}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalResults={totalMovies}
            onPageChange={setCurrentPage}
            itemLabel="top rated movies"
          />
        </>
      )}
    </div>
  );
};

export default TopRatedMovies;