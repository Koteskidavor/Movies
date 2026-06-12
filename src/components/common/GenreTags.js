import { memo } from "react";

const GenreTags = memo(({ genreNames }) => {
  return (
    <div className="genre-tags">
      {genreNames.map((name, index) => (
        <span key={index} className="genre-tag">{name}</span>
      ))}
    </div>
  );
});

export default GenreTags;
