import { memo } from "react";
import { getImageUrl } from "../../api/tmdb";
import { getRatingColor, formatReleaseDate } from "../../utils/helpers";
import MediaInfo from "./MediaInfo";

const MediaCard = memo(({ item, genres, mediaType, onClick }) => {
  const titleKey = mediaType === "movie" ? "title" : "name";
  const dateKey = mediaType === "movie" ? "release_date" : "first_air_date";
  const percentage = item.vote_average * 10;
  const strokeColor = getRatingColor(percentage);
  const genreNames = (item.genre_ids || []).map(
    (id) => genres.find((g) => g.id === id)?.name || "Unknown"
  );

  const posterUrl = getImageUrl(item.poster_path, "w342");

  return (
    <div className="media-card" role="button" tabIndex={0} onClick={() => onClick(item)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(item); } }}>
      <div className="movie-poster-wrap">
        {posterUrl ? (
          <img src={posterUrl} alt={`Poster for ${item[titleKey]}`} loading="lazy" />
        ) : (
          <div style={{ width: "100%", aspectRatio: "2/3", background: "#2a2a2a", display: "flex", alignItems: "center", justifyContent: "center", color: "#555", fontSize: "13px", fontWeight: 600, textAlign: "center", padding: "16px", boxSizing: "border-box" }}>
            {item[titleKey] || "No Poster"}
          </div>
        )}
        <div className="rating-container">
          <svg viewBox="0 0 100 100" width="44" height="44" aria-label={`Rating: ${percentage.toFixed(0)}%`} role="img">
            <title>{`Rating: ${percentage.toFixed(0)}%`}</title>
            <circle cx="50" cy="50" r="45" fill="#1a1a1a" opacity="0.85" />
            <circle cx="50" cy="50" r="45" fill="none" strokeWidth="10" stroke={strokeColor} strokeDasharray={`${percentage * 2.83}, 283`} transform="rotate(-90 50 50)" />
          </svg>
          <div className="rating-text">{percentage.toFixed(0)}%</div>
        </div>
      </div>
      <MediaInfo title={item[titleKey]} genreNames={genreNames} formatReleaseDate={formatReleaseDate(item[dateKey])} />
    </div>
  );
});

export default MediaCard;
