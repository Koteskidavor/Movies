import { memo } from "react";
import GenreTags from "./GenreTags";

const MediaInfo = memo(({ title, genreNames, formatReleaseDate }) => {
  return (
    <div className="title-and-date">
      <h2 className="title-container">{title}</h2>
      <GenreTags genreNames={genreNames} />
      <p className="date-container">{formatReleaseDate}</p>
    </div>
  );
});

export default MediaInfo;
