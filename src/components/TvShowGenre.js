import React from 'react';

const TvShowGenre = ({ genreNames }) => {
    return (
        <div style={{ width: '200px'}}>
            {genreNames.map((name, index) => (
                <div key={index} className="filterTv-genre">
                    {name}
                </div>
            ))}
        </div>
    )
}

export default TvShowGenre;