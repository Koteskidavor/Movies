import React, { useState, useEffect, useRef, useCallback } from "react";
import { CircularProgress } from "@mui/material";
import TvShowInfo from "./TvShowInfo";
import {
  discoverTvShows,
  searchTvShows,
  getImageUrl,
} from "../api/tmdb";
import useGenreFilteredList from "../hooks/useGenreFilteredList";
import Pagination from "./Pagination";
import "./FilterTvShows.css";

const genres = [
  { id: 10759, name: "Action & Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 99, name: "Documentary" },
  { id: 18, name: "Drama" },
  { id: 10751, name: "Family" },
  { id: 10762, name: "Kids" },
  { id: 9648, name: "Mystery" },
  { id: 10763, name: "News" },
  { id: 10764, name: "Reality" },
  { id: 10765, name: "Sci-Fi & Fantasy" },
  { id: 10766, name: "Soap" },
  { id: 10767, name: "Talk" },
  { id: 10768, name: "War & Politics" },
  { id: 37, name: "Western" },
];

const FilterTvShows = () => {
  const [tvShows, setTvShows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalTvShows, setTotalTvShows] = useState(0);
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
  } = useGenreFilteredList(discoverTvShows, selectedGenre, genres);

  useEffect(() => {
    if (!genreActive && previousStateRef.current !== null) {
      const snapshot = previousStateRef.current;
      previousStateRef.current = null;
      setTvShows(snapshot.tvShows);
      setCurrentPage(snapshot.currentPage);
      setTotalPages(snapshot.totalPages);
      setTotalTvShows(snapshot.totalTvShows);
    }
  }, [genreActive]);

  useEffect(() => {
    if (genreActive && previousStateRef.current === null) {
      previousStateRef.current = {
        tvShows,
        currentPage,
        totalPages,
        totalTvShows,
      };
    }
  }, [genreActive, tvShows, currentPage, totalPages, totalTvShows]);

  useEffect(() => {
    if (genreActive) return;
    let cancelled = false;
    setDefaultLoading(true);
    (async () => {
      try {
        const { data } = await discoverTvShows({ page: currentPage });
        if (cancelled) return;
        setTvShows(data.results);
        setTotalPages(data.total_pages);
        setTotalTvShows(data.total_results);
      } catch (err) {
        if (!cancelled) console.log("Error", err);
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
      searchTvShows(searchQuery)
        .then(({ data }) => {
          setSearchResults(data.results);
        })
        .catch((error) => {
          console.log(error);
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

  const renderTvShowCard = useCallback(
    (tvShow) => {
      const percentage = tvShow.vote_average * 10;
      const strokeColor =
        percentage > 70 ? "#63ad6c" : percentage > 50 ? "#bdb564" : "#e04146";
      const genreNames = tvShow.genre_ids.map(getGenreName);
      return (
        <div className="tvShow-card" key={tvShow.id}>
          <img
            src={getImageUrl(tvShow.backdrop_path)}
            alt={tvShow.name}
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
          <TvShowInfo
            title={tvShow.name}
            genreNames={genreNames}
            formatReleaseDate={formatReleaseDate(tvShow.first_air_date)}
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
        <h1 style={{ marginLeft: "20px" }}>Tv-Shows</h1>
        <input
          type="text"
          placeholder="Search Tv-Shows..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="tvShows-inputSearch"
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
              <div className="tvShows-container">
                {genreItems.map((tvShow) => renderTvShowCard(tvShow))}
              </div>
            )}
          </div>
          <Pagination
            currentPage={genreCurrentPage}
            totalPages={genreTotalPages}
            totalResults={genreTotalResults}
            onPageChange={setGenrePage}
            itemLabel={`${selectedGenre.join(", ")} shows`}
          />
        </>
      )}

      {showSearch && !showGenreView && (
        <div className="search-tvShows">
          {searchResults.map((tvShow) => (
            <div className="search-tvShows" key={tvShow.id}>
              {renderTvShowCard(tvShow)}
            </div>
          ))}
        </div>
      )}

      {!showGenreView && !showSearch && (
        <>
          <div className="tvShows-container">
            {defaultLoading && tvShows.length === 0 ? (
              <div className="genre-loading">
                <CircularProgress size={20} /> Loading...
              </div>
            ) : (
              tvShows.map((tvShow) => renderTvShowCard(tvShow))
            )}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalResults={totalTvShows}
            onPageChange={setCurrentPage}
            itemLabel="popular shows"
          />
        </>
      )}
    </div>
  );
};

export default FilterTvShows;
