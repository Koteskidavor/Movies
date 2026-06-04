import React, { useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import StarIcon from "@mui/icons-material/Star";
import {
  getMovieDetails,
  getMovieCredits,
  getImageUrl,
} from "../api/tmdb";
import "./MovieModal.css";


const MovieModal = ({ movie, onClose }) => {
  const [movieDetails, setMovieDetails] = useState(null);
  const [cast, setCast] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const [detailsResponse, creditsResponse] = await Promise.all([
          getMovieDetails(movie.id),
          getMovieCredits(movie.id),
        ]);
        setMovieDetails(detailsResponse.data);
        setCast(creditsResponse.data.cast.slice(0, 6));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching movie details:", error);
        setLoading(false);
      }
    };
    fetchMovieDetails();
  }, [movie.id]);

  if (!movie) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatRuntime = (minutes) => {
    if (!minutes) return "N/A";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          <CloseIcon />
        </button>

        {loading ? (
          <div className="modal-loading">Loading...</div>
        ) : (
          <>
            <div
              className="modal-backdrop"
              style={{
                backgroundImage: movieDetails?.backdrop_path
                  ? `url(${getImageUrl(movieDetails.backdrop_path)})`
                  : movie.poster_path
                    ? `url(${getImageUrl(movie.poster_path)})`
                    : "none",
              }}
            >
              <div className="modal-backdrop-overlay"></div>
            </div>

            <div className="modal-body">
              <div className="modal-header">
                <h1 className="modal-title">{movie.title}</h1>
                <div className="modal-meta">
                  <span className="modal-rating">
                    <StarIcon className="star-icon" />
                    {movie.vote_average?.toFixed(1)}
                  </span>
                  <span className="modal-date">
                    {formatDate(movieDetails?.release_date)}
                  </span>
                  <span className="modal-runtime">
                    {formatRuntime(movieDetails?.runtime)}
                  </span>
                </div>
                <div className="modal-genres">
                  {movieDetails?.genres?.map((genre) => (
                    <span key={genre.id} className="modal-genre-tag">
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="modal-overview">
                <h3>Overview</h3>
                <p>{movie.overview || movieDetails?.overview}</p>
              </div>

              <div className="modal-cast">
                <h3>Cast</h3>
                <div className="cast-grid">
                  {cast.map((actor) => (
                    <div key={actor.id} className="cast-member">
                      <img
                        src={
                          actor.profile_path
                            ? getImageUrl(actor.profile_path, "w185")
                            : "https://via.placeholder.com/100x150?text=No+Image"
                        }
                        alt={actor.name}
                        className="cast-image"
                      />
                      <p className="cast-name">{actor.name}</p>
                      <p className="cast-character">{actor.character}</p>
                    </div>
                  ))}
                </div>
              </div>

              {movieDetails?.tagline && (
                <div className="modal-tagline">
                  <em>"{movieDetails.tagline}"</em>
                </div>
              )}

              <div className="modal-additional-info">
                <div className="info-item">
                  <strong>Status:</strong> {movieDetails?.status}
                </div>
                <div className="info-item">
                  <strong>Original Language:</strong>{" "}
                  {movieDetails?.original_language?.toUpperCase()}
                </div>
                <div className="info-item">
                  <strong>Budget:</strong>{" "}
                  {movieDetails?.budget
                    ? `$${movieDetails.budget.toLocaleString()}`
                    : "N/A"}
                </div>
                <div className="info-item">
                  <strong>Revenue:</strong>{" "}
                  {movieDetails?.revenue
                    ? `$${movieDetails.revenue.toLocaleString()}`
                    : "N/A"}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MovieModal;