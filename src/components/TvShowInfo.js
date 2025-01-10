import React from 'react';
import TvShowGenre from "./TvShowGenre";
const TvShowInfo = ({ title, genreNames, formatReleaseDate }) => {
    return (
        <div className="title-and-date">
            <h2 className="title-container" style={{ width: '200px'}}>{title}</h2>
            <TvShowGenre
                genreNames={genreNames}
            />
            <h5 className="date-container">{formatReleaseDate}</h5>
        </div>
    )
}

export default TvShowInfo;