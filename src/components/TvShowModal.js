import { useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import StarIcon from "@mui/icons-material/Star";
import {
  getTvShowDetails,
  getTvShowCredits,
  getImageUrl,
} from "../api/tmdb";
import "./TvShowModal.css";

const TvShowModal = ({ tvShow, onClose }) => {
  const [tvShowDetails, setTvShowDetails] = useState(null);
  const [cast, setCast] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTvShowDetails = async () => {
      try {
        const [detailsResponse, creditsResponse] = await Promise.all([
          getTvShowDetails(tvShow.id),
          getTvShowCredits(tvShow.id),
        ]);
        setTvShowDetails(detailsResponse.data);
        setCast(creditsResponse.data.cast.slice(0, 6));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching TV show details:", error);
        setLoading(false);
      }
    };
    fetchTvShowDetails();
  }, [tvShow.id]);

  if (!tvShow) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatEpisodeRuntime = (episodeRuntime) => {
    if (!episodeRuntime || episodeRuntime.length === 0) return "N/A";
    return `${episodeRuntime[0]}m`;
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
                backgroundImage: tvShowDetails?.backdrop_path
                  ? `url(${getImageUrl(tvShowDetails.backdrop_path)})`
                  : tvShow.poster_path
                    ? `url(${getImageUrl(tvShow.poster_path)})`
                    : "none",
              }}
            >
              <div className="modal-backdrop-overlay"></div>
            </div>

            <div className="modal-body">
              <div className="modal-header">
                <h1 className="modal-title">{tvShow.name}</h1>
                <div className="modal-meta">
                  <span className="modal-rating">
                    <StarIcon className="star-icon" />
                    {tvShow.vote_average?.toFixed(1)}
                  </span>
                  <span className="modal-date">
                    {formatDate(tvShowDetails?.first_air_date)}
                  </span>
                  <span className="modal-runtime">
                    {formatEpisodeRuntime(tvShowDetails?.episode_run_time)}
                  </span>
                </div>
                <div className="modal-genres">
                  {tvShowDetails?.genres?.map((genre) => (
                    <span key={genre.id} className="modal-genre-tag">
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="modal-overview">
                <h3>Overview</h3>
                <p>{tvShow.overview || tvShowDetails?.overview}</p>
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

              {tvShowDetails?.tagline && (
                <div className="modal-tagline">
                  <em>"{tvShowDetails.tagline}"</em>
                </div>
              )}

              <div className="modal-additional-info">
                <div className="info-item">
                  <strong>Status:</strong> {tvShowDetails?.status}
                </div>
                <div className="info-item">
                  <strong>Original Language:</strong>{" "}
                  {tvShowDetails?.original_language?.toUpperCase()}
                </div>
                <div className="info-item">
                  <strong>Seasons:</strong> {tvShowDetails?.number_of_seasons}
                </div>
                <div className="info-item">
                  <strong>Episodes:</strong> {tvShowDetails?.number_of_episodes}
                </div>
                <div className="info-item">
                  <strong>First Aired:</strong>{" "}
                  {formatDate(tvShowDetails?.first_air_date)}
                </div>
                <div className="info-item">
                  <strong>Last Aired:</strong>{" "}
                  {formatDate(tvShowDetails?.last_air_date)}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TvShowModal;