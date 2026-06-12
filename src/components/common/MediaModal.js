import { useState, useEffect, useRef, useMemo } from "react";
import { getRatingColor, formatDate } from "../../utils/helpers";
import {
  getMovieDetails,
  getMovieCredits,
  getTvShowDetails,
  getTvShowCredits,
  getImageUrl,
} from "../../api/tmdb";
import ErrorBoundary from "./ErrorBoundary";
import "./MediaModal.css";

const MediaModal = ({ item, mediaType, onClose }) => {
  const isMovie = mediaType === "movie";
  const [details, setDetails] = useState(null);
  const [cast, setCast] = useState([]);
  const [loading, setLoading] = useState(true);

  const title = isMovie ? item.title : item.name;

  const fetch = useMemo(() => ({
    details: isMovie ? getMovieDetails : getTvShowDetails,
    credits: isMovie ? getMovieCredits : getTvShowCredits,
  }), [isMovie]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    const controller = new AbortController();
    const opts = { signal: controller.signal };

    (async () => {
      try {
        const [detailsRes, creditsRes] = await Promise.all([
          fetch.details(item.id, opts),
          fetch.credits(item.id, opts),
        ]);
        if (controller.signal.aborted) return;
        setDetails(detailsRes.data);
        setCast(creditsRes.data.cast.slice(0, 6));
      } catch (error) {
        if (error?.name !== "CanceledError" && error?.code !== "ERR_CANCELED") {
          console.error("MediaModal fetch error:", error);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [item.id, fetch]);

  const modalRef = useRef(null);

  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;
    const focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const handleTab = (e) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    };
    modal.addEventListener("keydown", handleTab);
    first?.focus();
    return () => modal.removeEventListener("keydown", handleTab);
  }, [loading]);

  if (!item) return null;

  const formatRuntime = (minutes) => {
    if (!minutes) return "N/A";
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  };

  const runtimeLabel = isMovie
    ? formatRuntime(details?.runtime)
    : details?.episode_run_time?.length
      ? `${details.episode_run_time[0]}m`
      : "N/A";

  return (
    <ErrorBoundary name="media-modal" title="Failed to load details" message="There was a problem loading the details. Close the modal and try again.">
      <div className="modal-overlay" role="dialog" aria-modal="true" aria-label={title} onClick={onClose}>
        <div className="modal-content" ref={modalRef} onClick={(e) => e.stopPropagation()}>
          <button className="close-button" onClick={onClose} aria-label="Close modal">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>

          {loading ? (
            <div className="modal-loading">Loading...</div>
          ) : (
            <>
              <div
                className="modal-backdrop"
                style={{
                  backgroundImage: details?.backdrop_path
                    ? `url(${getImageUrl(details.backdrop_path, "w1280")})`
                    : item.poster_path
                      ? `url(${getImageUrl(item.poster_path, "w500")})`
                      : "none",
                }}
              >
                <div className="modal-backdrop-overlay"></div>
              </div>

              <div className="modal-body">
                <div className="modal-header">
                  <h1 className="modal-title">{title}</h1>
                  <div className="modal-meta">
                    <span className="modal-rating" style={{ color: getRatingColor(item.vote_average * 10) }}>
                      <svg className="star-icon" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                      {item.vote_average?.toFixed(1)}
                    </span>
                    <span className="modal-date">
                      {formatDate(isMovie ? details?.release_date : details?.first_air_date)}
                    </span>
                    <span className="modal-runtime">{runtimeLabel}</span>
                  </div>
                  <div className="modal-genres">
                    {details?.genres?.map((genre) => (
                      <span key={genre.id} className="modal-genre-tag">{genre.name}</span>
                    ))}
                  </div>
                </div>

                <div className="modal-overview">
                  <h3>Overview</h3>
                  <p>{item.overview || details?.overview}</p>
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
                              : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='150'%3E%3Crect fill='%23333' width='100' height='150'/%3E%3Ctext fill='%23666' font-size='10' x='50' y='75' text-anchor='middle' dominant-baseline='central'%3ENo Image%3C/text%3E%3C/svg%3E"
                          }
                          alt={actor.name}
                          className="cast-image"
                          loading="lazy"
                        />
                        <p className="cast-name">{actor.name}</p>
                        <p className="cast-character">{actor.character}</p>
                      </div>
                    ))}
                  </div>
                </div>
                {details?.tagline && (
                  <div className="modal-tagline">
                    <em>"{details.tagline}"</em>
                  </div>
                )}

                <div className="modal-additional-info">
                  <div className="info-item">
                    <strong>Status:</strong> {details?.status}
                  </div>
                  <div className="info-item">
                    <strong>Original Language:</strong> {details?.original_language?.toUpperCase()}
                  </div>
                  {isMovie ? (
                    <>
                      <div className="info-item">
                        <strong>Budget:</strong> {details?.budget ? `$${details.budget.toLocaleString()}` : "N/A"}
                      </div>
                      <div className="info-item">
                        <strong>Revenue:</strong> {details?.revenue ? `$${details.revenue.toLocaleString()}` : "N/A"}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="info-item">
                        <strong>Seasons:</strong> {details?.number_of_seasons}
                      </div>
                      <div className="info-item">
                        <strong>Episodes:</strong> {details?.number_of_episodes}
                      </div>
                      <div className="info-item">
                        <strong>First Aired:</strong> {formatDate(details?.first_air_date)}
                      </div>
                      <div className="info-item">
                        <strong>Last Aired:</strong> {formatDate(details?.last_air_date)}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default MediaModal;
