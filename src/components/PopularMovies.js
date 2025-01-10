import React, { useState, useEffect } from "react";
import MovieInfo from "./MovieInfo";
import { Tooltip, Button } from "@mui/material";
import axios from "axios";
import { API_AUTH } from "./API_KEY";

const PopularMovies = () => {
  const [popularMovies, setPopularMovies] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalMovies, setTotalMovies] = useState(0);

  useEffect(() => {
    fetchMovies(currentPage);
  }, [currentPage]);
  const fetchMovies = async (page) => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/popular?api_key=${API_AUTH}&page=${page}`
      );
      const data = response.data;
      setPopularMovies((prevMovies) => {
        const newMovies = data.results.filter(
          (newMovie) =>
            !prevMovies.some((prevMovie) => prevMovie.id === newMovie.id)
        );
        return [...prevMovies, ...newMovies];
      });
      setTotalPages(data.total_pages);
      setTotalMovies(data.total_results);
    } catch (error) {
      console.log("Error: ", error);
    }
  };
  const loadMore = () => {
    setCurrentPage(currentPage + 1);
  };
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
  const handleGenreClick = (genreName) => {
    if (!selectedGenre.includes(genreName)) {
      setSelectedGenre([...selectedGenre, genreName]);
    }
  };
  const handleGenreCloseClick = (genreName) => {
    setSelectedGenre(selectedGenre.filter((genre) => genre !== genreName));
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
  function getGenreName(genreId) {
    const genre = genres.find((genre) => genre.id === genreId);
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
  return (
    <div>
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
      <div className="movie-container">
        {popularMovies
          .filter((movie) => {
            const genreName = movie.genre_ids.map(getGenreName);
            return selectedGenre.every((genre) => genreName.includes(genre));
          })
          .map((movie) => {
            const percentage = movie.vote_average * 10;
            const strokeColor = getStrokeColor(percentage);
            const genreNames = movie.genre_ids.map(getGenreName);
            return (
              <div key={movie.id * Math.random()} className="movie-card">
                <img
                  src={`https://image.tmdb.org/t/p/original${movie.poster_path}`}
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
          })}
      </div>
      <div className="load-moreContainer">
        {currentPage < totalPages && (
          <Tooltip
            title={`Movies left: ${totalMovies - popularMovies.length}`}
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

export default PopularMovies;
