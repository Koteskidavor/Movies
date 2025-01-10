import React from 'react';
const MoviesGenre = ({ genreNames }) => {
    return (
        <div style={{ width: '200px'}}>
            {genreNames.map((name, index) => (
                <div key={index} className="filterMovies-genre" >
                    {name}
                </div>
            ))}
        </div>
    )
}

export default MoviesGenre;