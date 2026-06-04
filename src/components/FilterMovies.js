import React, { useState, useEffect, useRef, useCallback } from "react";
import { CircularProgress } from "@mui/material";
import MovieInfo from "./MovieInfo";
import {
  discoverMovies,
  searchMovies,
  getImageUrl,
} from "../api/tmdb";
import useGenreFilteredList from "../hooks/useGenreFilteredList";
import Pagination from "./Pagination";
import "./FilterMovies.css";

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

const FilterMovies = () => {
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalMovies, setTotalMovies] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
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
      setMovies(snapshot.movies);
      setCurrentPage(snapshot.currentPage);
      setTotalPages(snapshot.totalPages);
      setTotalMovies(snapshot.totalMovies);
    }
  }, [genreActive]);

  useEffect(() => {
    if (genreActive && previousStateRef.current === null) {
      previousStateRef.current = {
        movies,
        currentPage,
        totalPages,
        totalMovies,
      };
    }
  }, [genreActive, movies, currentPage, totalPages, totalMovies]);

  useEffect(() => {
    if (genreActive) return;
    let cancelled = false;
    setDefaultLoading(true);
    (async () => {
      try {
        const { data } = await discoverMovies({ page: currentPage });
        if (cancelled) return;
        setMovies(data.results);
        setTotalPages(data.total_pages);
        setTotalMovies(data.total_results);
      } catch (err) {
        if (!cancelled) console.log("Error: ", err);
      } finally {
        if (!cancelled) setDefaultLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [currentPage, genreActive]);

  useEffect(() => {
    if (searchQuery) {
      searchMovies(searchQuery)
        .then(({ data }) => {
          setSearchResults(data.results);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  function formatReleaseDate(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;
    return `${formattedDay}-${formattedMonth}-${year}`;
  }

  function getGenreName(genreId) {
    const genre = genres.find((genre) => genre.id === genreId);
    return genre ? genre.name : "Unknown";
  }

  const handleGenreClick = (genreName) => {
    if (!selectedGenre.includes(genreName)) {
      setSelectedGenre([...selectedGenre, genreName]);
    }
  };
  const handleGenreCloseClick = (genreName) => {
    setSelectedGenre(selectedGenre.filter((genre) => genre !== genreName));
  };

  const renderMovieCard = useCallback(
    (movie) => {
      const percentage = movie.vote_average * 10;
      const strokeColor =
        percentage > 70 ? "#63ad6c" : percentage > 50 ? "#bdb564" : "#e04146";
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const showSearch = searchQuery !== "" && searchResults.length > 0;
  const showGenreView = genreActive;

  return (
    <div>
      <div className="page-nav">
        <h1 style={{ marginLeft: "20px" }}>Movies</h1>
        <input
          type="text"
          placeholder="Search movies..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="action-inputSearch"
        />
      </div>
      <div className="genre-filter">
        {genres.map((genre) => (
          <div
            key={genre.id}
            className={`genre-item ${
              selectedGenre.includes(genre.name) ? "selected" : ""
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
          <div className="genre-status">
            {genreLoading && genreItems.length === 0 ? (
              <div className="genre-loading">
                <CircularProgress size={20} /> Loading {selectedGenre.join(", ")}...
              </div>
            ) : (
              <div className="movie-container">
                {genreItems.map((movie) => renderMovieCard(movie))}
              </div>
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

      {showSearch && !showGenreView && (
        <div className="search-movies">
          {searchResults.map((movie) => (
            <div className="search-movies" key={movie.id}>
              {renderMovieCard(movie)}
            </div>
          ))}
        </div>
      )}

      {!showGenreView && !showSearch && (
        <>
          <div className="movie-container">
            {defaultLoading && movies.length === 0 ? (
              <div className="genre-loading">
                <CircularProgress size={20} /> Loading...
              </div>
            ) : (
              movies.map((movie) => renderMovieCard(movie))
            )}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalResults={totalMovies}
            onPageChange={setCurrentPage}
            itemLabel="popular movies"
          />
        </>
      )}
    </div>
  );
};

export default FilterMovies;
