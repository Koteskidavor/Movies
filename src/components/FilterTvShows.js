import React, { useState, useEffect } from "react";
import { API_AUTH } from "./API_KEY";
import axios from "axios";
import TvShowInfo from "./TvShowInfo";
import { Button, Tooltip } from "@mui/material";
import "./FilterTvShows.css";

const FilterTvShows = () => {
  const [tvShows, setTvShows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalTvShows, setTotalTvShows] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState([]);

  useEffect(() => {
    fetchTvShows(currentPage);
  }, [currentPage]);
  const fetchTvShows = async (page) => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/discover/tv?api_key=${API_AUTH}&page=${page}`
      );
      const data = response.data;
      setTvShows((prevTvShows) => {
        const newTvShows = data.results.filter(
          (newTvShow) =>
            !prevTvShows.some((prevTvShows) => prevTvShows.id === newTvShow.id)
        );
        return [...prevTvShows, ...newTvShows];
      });
      setTotalPages(data.total_pages);
      setTotalTvShows(data.total_results);
    } catch (error) {
      console.log("Error", error);
    }
  };
  const loadMore = () => {
    setCurrentPage(currentPage + 1);
  };
  function getStrokeColor(percentage) {
    if (percentage > 70) {
      return "#63ad6c";
    } else if (percentage > 50) {
      return "#bdb564";
    } else {
      return "#e04146";
    }
  }
  useEffect(() => {
    if (searchQuery) {
      const url = `https://api.themoviedb.org/3/search/tv?api_key=${API_AUTH}&query=${searchQuery}`;

      fetch(url)
        .then((response) => response.json())
        .then((data) => {
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
  return (
    <div>
      <div className="page-nav">
        <h1 style={{ marginLeft: "20px" }}>Tv-Shows</h1>
        <input
          type="text"
          placeholder="Search Tv-Shows..."
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
      <div className="search-tvShows">
        {searchResults &&
          searchResults
            .filter((tvShow) => {
              const genreName = tvShow.genre_ids.map(getGenreName);
              return selectedGenre.every((genre) => genreName.includes(genre));
            })
            .map((tvShow) => {
              const percentage = tvShow.vote_average * 10;
              const strokeColor = getStrokeColor(percentage);
              const genreNames = tvShow.genre_ids.map(getGenreName);
              return (
                <div key={tvShow.id} className="search-tvShows">
                  <div className="tvShow-card">
                    <img
                      src={`https://image.tmdb.org/t/p/original${tvShow.backdrop_path}`}
                      alt={tvShow.title}
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
                      <div className="rating-text">
                        {percentage.toFixed(0)}%
                      </div>
                    </div>
                    <TvShowInfo
                      title={tvShow.name}
                      genreNames={genreNames}
                      formatReleaseDate={formatReleaseDate(
                        tvShow.first_air_date
                      )}
                    />
                  </div>
                </div>
              );
            })}
      </div>
      <div className="tvShows-container">
        {searchQuery === "" || (searchResults && searchResults.length === 0)
          ? tvShows
              .filter((tvShows) => {
                const genreName = tvShows.genre_ids.map(getGenreName);
                return selectedGenre.every((genre) =>
                  genreName.includes(genre)
                );
              })
              .map((tvShow) => {
                const percentage = tvShow.vote_average * 10;
                const strokeColor = getStrokeColor(percentage);
                const genreNames = tvShow.genre_ids.map(getGenreName);
                return (
                  <div key={tvShow.id * Math.random()} className="tvShow-card">
                    <img
                      src={`https://image.tmdb.org/t/p/original${tvShow.backdrop_path}`}
                      alt={tvShow.title}
                      style={{ width: "200px" }}
                    />
                    <div className="rating-container">
                      <svg
                        viewBox="0 0 100 100"
                        className="percentage-circle"
                        width="50"
                        height="50"
                      >
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
                      <div className="rating-text">
                        {percentage.toFixed(0)}%
                      </div>
                    </div>
                    <TvShowInfo
                      title={tvShow.name}
                      genreNames={genreNames}
                      formatReleaseDate={formatReleaseDate(
                        tvShow.first_air_date
                      )}
                    />
                  </div>
                );
              })
          : null}
      </div>
      <div className="load-moreContainer">
        {currentPage < totalPages && (
          <Tooltip
            title={`Tv-Shows left: ${totalTvShows - tvShows.length}`}
            variant="text"
            placement="top"
          >
            <Button
              className="load-more-button"
              onClick={loadMore}
              variant="text"
              sx={{ color: "black" }}
            >
              Load More...
            </Button>
          </Tooltip>
        )}
      </div>
    </div>
  );
};

export default FilterTvShows;
