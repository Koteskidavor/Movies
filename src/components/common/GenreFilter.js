import { memo, useRef } from "react";

const GenreFilter = ({ genres, selectedGenre, onGenreClick, onGenreCloseClick }) => {
  const scrollRef = useRef(null);

  const scrollGenres = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: direction * 200, behavior: "smooth" });
    }
  };

  return (
    <div className="genre-filter-wrapper">
      <button className="genre-scroll genre-scroll-left" onClick={() => scrollGenres(-1)} aria-label="Scroll genres left">‹<span className="sr-only">Scroll genres left</span></button>
      <div className="genre-filter" ref={scrollRef}>
        {genres.map((genre) => (
          <div key={genre.id} className={`genre-item ${selectedGenre.includes(genre.name) ? "selected" : ""}`}>
            <span tabIndex={0} role="button" onClick={() => onGenreClick(genre.name)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onGenreClick(genre.name); } }}>{genre.name}</span>
            {selectedGenre.includes(genre.name) && (
              <span className="close-icon" tabIndex={0} role="button" aria-label={`Remove ${genre.name} filter`} onClick={() => onGenreCloseClick(genre.name)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onGenreCloseClick(genre.name); } }}>&#x2715;</span>
            )}
          </div>
        ))}
      </div>
      <button className="genre-scroll genre-scroll-right" onClick={() => scrollGenres(1)} aria-label="Scroll genres right">›<span className="sr-only">Scroll genres right</span></button>
    </div>
  );
};

export default memo(GenreFilter);
