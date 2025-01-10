import React, { useState, useEffect } from 'react';
import { Typography } from '@mui/material';
import { API_KEY, API_AUTH } from "./API_KEY";
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import './Home.css';

const Home = () => {
    const [popularMovies, setPopularMovies] = useState([]);
    const [popularTvShows, setPopularTvShows] = useState([]);
    const [combinedData, setCombinedData] = useState([]);
    const [actionMovies, setActionMovies] = useState([]);
    const [comedyMovies, setComedyMovies] = useState([]);
    const [comedyTvShows, setComedyTvShows] = useState([]);
    const [combinedComedyMovies, setCombinedComedyMovies] = useState([]);
    const [documentaryMovies, setDocumentaryMovies] = useState([]);
    const [documentaryTvShows, setDocumentaryTvShows] = useState([]);
    const [combinedDocumentaryData, setCombinedDocumentaryData] = useState([]);
    const [historyMovies, setHistoryMovies] = useState([]);
    const [historyTvShows, setHistoryTvShows] = useState([]);
    const [combinedHistory, setCombinedHistory] = useState([]);
    const [horrorMovie, setHorrorMovie] = useState([]);
    const [horrorTvShows, setHorrorTvShows] = useState([]);
    const [combinedHorror, setCombinedHorror] = useState([]);
    const [scienceFictionMovies, setScienceFictionMovies] = useState([]);

    const itemPerPage = 8;

    const [currentPage, setCurrentPage] = useState(0);
    const [currentActionPage, setCurrentActionPage] = useState(0);
    const [currentComedyPage, setCurrentComedyPage] = useState(0);
    const [currentDocumentaryPage, setCurrentDocumentaryPage] = useState(0);
    const [currentHistoryPage, setCurrentHistoryPage] = useState(0);
    const [currentHorrorPage, setCurrentHorrorPage] = useState(0);
    const [currentSFPage, setCurrentSFPage] = useState(0);

    useEffect(() => {
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${API_KEY}`,
            }
        }
        fetch('https://api.themoviedb.org/3/movie/popular?language=en-US&page=1', options)
            .then(response => response.json())
            .then(data => setPopularMovies(data.results))
            .catch(err => console.error(err));
        fetch('https://api.themoviedb.org/3/tv/popular?language=en-US&page=1', options)
            .then(response => response.json())
            .then(data => setPopularTvShows(data.results))
            .catch(err => console.error(err));
        fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_AUTH}&with_genres=28`)
            .then(response => response.json())
            .then(data => setActionMovies(data.results))
            .catch(err => console.error(err));
        fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_AUTH}&with_genres=35`)
            .then(response => response.json())
            .then(data => setComedyMovies(data.results))
            .catch(err => console.error(err));
        fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${API_AUTH}&sort_by=popularity.desc&with_genres=35`)
            .then(response => response.json())
            .then(data => setComedyTvShows(data.results))
            .catch(err => console.error(err));
        fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_AUTH}&with_genres=99`)
            .then(response => response.json())
            .then(data => setDocumentaryMovies(data.results))
            .catch(err => console.error(err));
        fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${API_AUTH}&sort_by=popularity.desc&with_genres=99`)
            .then(response => response.json())
            .then(data => setDocumentaryTvShows(data.results))
            .catch(err => console.error(err));
        fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_AUTH}&with_genres=36`)
            .then(response => response.json())
            .then(data => setHistoryMovies(data.results))
            .catch(err => console.error(err));
        fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${API_AUTH}&sort_by=popularity.desc&with_genres=36`)
            .then(response => response.json())
            .then(data => setHistoryTvShows(data.results))
            .catch(err => console.error(err));
        fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_AUTH}&with_genres=27`)
            .then(response => response.json())
            .then(data => setHorrorMovie(data.results))
            .catch(err => console.error(err));
        fetch(`https://api.themoviedb.org/3/discover/tv?api_key=${API_AUTH}&sort_by=popularity.desc&with_genres=27`)
            .then(response => response.json())
            .then(data => setHorrorTvShows(data.results))
            .catch(err => console.error(err))
        fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_AUTH}&with_genres=878`)
            .then(response => response.json())
            .then(data => setScienceFictionMovies(data.results))
            .catch(err => console.error(err))
    }, []);
    // crime: 80, documentary: 99, history: 36, horror: 27, sf: 878
    function shuffleArray(array) {
        for(let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    const handlePrevClick = () => {
        setCurrentPage((prevPage) => prevPage - 1);
    }
    const handleNextClick = () => {
        setCurrentPage((prevPage) => prevPage + 1);
    }
    useEffect(() => {
        const shuffledData = shuffleArray([...popularMovies, ...popularTvShows]);
        setCombinedData(shuffledData);
    }, [popularMovies, popularTvShows])
    useEffect(() => {
        if(comedyMovies.length > 0 && comedyTvShows.length > 0) {
            const shuffleComedyData = shuffleArray([...comedyMovies, ...comedyTvShows])
            setCombinedComedyMovies(shuffleComedyData)
        }
    }, [comedyMovies, comedyTvShows]);
    useEffect(() => {
        if(documentaryMovies.length > 0 && documentaryTvShows.length > 0) {
            const shuffleDocumentaryData = shuffleArray([...documentaryMovies, ...documentaryTvShows])
            setCombinedDocumentaryData(shuffleDocumentaryData);
        }
    }, [documentaryMovies, documentaryTvShows]);
    useEffect(() => {
        if(historyMovies.length > 0 && historyTvShows.length > 0) {
            const shuffleHistory = shuffleArray([...historyMovies, ...historyTvShows]);
            setCombinedHistory(shuffleHistory);
        }
    }, [historyMovies, historyTvShows]);
    useEffect(() => {
        if(horrorMovie.length > 0) {
            const shuffleHorror = shuffleArray([...horrorMovie, ...horrorTvShows]);
            setCombinedHorror(shuffleHorror);
        }
    }, [horrorMovie, horrorTvShows]);
    const visibleMovie = combinedData.slice(
        currentPage * itemPerPage,
        currentPage * itemPerPage + itemPerPage,
    )
    const visibleActionMovie = actionMovies.slice(
        currentActionPage * itemPerPage,
        currentActionPage * itemPerPage + itemPerPage,
    )
    const visibleComedyMovie = combinedComedyMovies.slice(
        currentComedyPage * itemPerPage,
        currentComedyPage * itemPerPage + itemPerPage,
    );
    const visibleDocumentaryMovie = combinedDocumentaryData.slice(
        currentDocumentaryPage * itemPerPage,
        currentDocumentaryPage * itemPerPage + itemPerPage,
    )
    const visibleHistoryMovie = combinedHistory.slice(
        currentHistoryPage * itemPerPage,
        currentHistoryPage * itemPerPage + itemPerPage,
    )
    const visibleHorrorMovie = combinedHorror.slice(
        currentHorrorPage * itemPerPage,
        currentHorrorPage * itemPerPage + itemPerPage
    )
    const visibleSFMovie = scienceFictionMovies.slice(
        currentSFPage * itemPerPage,
        currentSFPage * itemPerPage + itemPerPage,
    )
    const prevActionClick = () => {
        setCurrentActionPage((prevPage) => prevPage - 1);
    }
    const nextActionClick = () => {
        setCurrentActionPage((prevPage) => prevPage + 1)
    }
    const prevComedyClick = () => {
        setCurrentComedyPage((prevPage) => prevPage - 1);
    }
    const nextComedyClick = () => {
        setCurrentComedyPage((prevPage) => prevPage + 1);
    }
    const prevDocumentaryClick = () => {
        setCurrentDocumentaryPage((prevPage) => prevPage - 1);
    }
    const nextDocumentaryClick = () => {
        setCurrentDocumentaryPage((prevPage) => prevPage + 1);
    }
    const prevHistoryClick = () => {
        setCurrentHistoryPage((prevPage) => prevPage - 1);
    }
    const nextHistoryClick = () => {
        setCurrentHistoryPage((prev) => prev + 1);
    }
    const prevHorrorClick = () => {
        setCurrentHorrorPage((prev) => prev - 1);
    }
    const nextHorrorClick = () => {
        setCurrentHorrorPage((prev) => prev + 1);
    }
    const prevSFClick = () => {
        setCurrentSFPage((prev) => prev - 1);
    }
    const nextSFClick = () => {
        setCurrentSFPage((prev) => prev + 1);
    }
    return (
        <div>
            <Typography variant="h2">Popular</Typography>
            <div className="carousel-container">
                <div className="movies">
                    {visibleMovie.map(movie => (
                        <div key={movie.id} className="popular-movies">
                            <img src={`https://image.tmdb.org/t/p/original${movie.poster_path}`} alt={movie.title} style={{ width: '200px', }} />
                            <div className="vote-text">{movie.vote_average * 10}% Rating</div>
                            <Typography key={movie.id} className="movie-title" >{movie.title ? movie.title : movie.name}</Typography>
                        </div>
                    ))}
                </div>
                <div className="navigation">
                    {currentPage > 0 && (
                        <button className="prev-button" onClick={handlePrevClick}>
                            <KeyboardArrowLeftIcon />
                        </button>
                    )}
                    {currentPage < Math.ceil(popularMovies.length / itemPerPage) - 1 && (
                        <button className="next-button" onClick={handleNextClick} style={{ right: 0}}>
                            <KeyboardArrowRightIcon />
                        </button>
                    )}
                </div>
            </div>
            <Typography variant="h2">Action</Typography>
            <div className="carousel-container" >
                <div className="movies">
                    {visibleActionMovie.map(movie => (
                        <div className="action-movies" key={movie.id}  >
                            <img src={`https://image.tmdb.org/t/p/original${movie.poster_path}`} alt={movie.original_title} style={{ width: '200px', }} />
                            <div className="vote-text">{movie.vote_average * 10}% Rating</div>
                            <Typography key={movie.id} className="movie-title" >{movie.original_title}</Typography>
                        </div>
                    ))}
                </div>
                <div className="navigation">
                    {currentActionPage > 0 && (
                        <button className="prev-button" onClick={prevActionClick}>
                            <KeyboardArrowLeftIcon />
                        </button>
                    )}
                    {currentActionPage < Math.ceil(actionMovies.length / itemPerPage) - 1 && (
                        <button className="next-button" onClick={nextActionClick} style={{ right: 0}}>
                            <KeyboardArrowRightIcon />
                        </button>
                    )}
                </div>
            </div>
            <Typography variant="h2">Comedy</Typography>
            <div className="carousel-container">
                <div className="movies">
                    {visibleComedyMovie.map(movie => (
                        <div className="comedy-movie" key={movie.id}>
                            <img src={`https://image.tmdb.org/t/p/original${movie.poster_path}`} alt={movie.original_name ? movie.original_name : movie.original_title} style={{ width: '200px', height: '300px'}} />
                            <div className="vote-text">{movie.vote_average * 10}% Rating</div>
                            <div className="movie-title">{movie.original_title ? movie.original_title : movie.original_name}</div>
                        </div>
                    ))}
                </div>
                <div className="navigation">
                    {currentComedyPage > 0 && (
                        <button className="prev-button" onClick={prevComedyClick}>
                            <KeyboardArrowLeftIcon />
                        </button>
                    )}
                    {currentActionPage < Math.ceil(comedyMovies.length / itemPerPage) - 1 && (
                        <button className="next-button" onClick={nextComedyClick} style={{ right: 0}}>
                            <KeyboardArrowRightIcon />
                        </button>
                    )}
                </div>
            </div>
            <Typography variant="h2">Documentaries</Typography>
            <div className="carousel-container">
                <div className="movies">
                    {visibleDocumentaryMovie.map(movie => (
                        <div className="documentary-movie" key={movie.id}>
                            <img src={`https://image.tmdb.org/t/p/original${movie.poster_path}`} alt="" style={{ width: '200px', height: '300px'}} />
                            <div className="vote-text">{movie.vote_average * 10}% Rating</div>
                            <div className="movie-title">{movie.original_title ? movie.original_title : movie.original_name}</div>
                        </div>
                    ))}
                </div>
                <div className="navigation">
                    {currentDocumentaryPage > 0 && (
                        <button className="prev-button" onClick={prevDocumentaryClick}>
                            <KeyboardArrowLeftIcon />
                        </button>
                    )}
                    {currentDocumentaryPage < Math.ceil(documentaryMovies.length / itemPerPage) - 1 && (
                        <button className="next-button" onClick={nextDocumentaryClick} style={{ right: 0}}>
                            <KeyboardArrowRightIcon />
                        </button>
                    )}
                </div>
            </div>
            <Typography variant="h2">History</Typography>
            <div className="carousel-container">
                <div className="movies">
                    {visibleHistoryMovie.map(movie => (
                        <div className="history-movie" key={movie.id} >
                            <img src={`https://image.tmdb.org/t/p/original${movie.poster_path}`} alt="" style={{ width: '200px', height: '300px'}} />
                            <div className="vote-text">{movie.vote_average * 10}% Rating</div>
                            <div className="movie-title">{movie.original_title ? movie.original_title : movie.original_name}</div>
                        </div>
                    ))}
                </div>
                <div className="navigation">
                    {currentHistoryPage > 0 && (
                        <button className="prev-button" onClick={prevHistoryClick}>
                            <KeyboardArrowLeftIcon />
                        </button>
                    )}
                    {currentHistoryPage < Math.ceil(historyMovies.length / itemPerPage) - 1 && (
                        <button className="next-button" onClick={nextHistoryClick} style={{ right: 0}}>
                            <KeyboardArrowRightIcon />
                        </button>
                    )}
                </div>
            </div>
            <Typography variant="h2" >Horror</Typography>
            <div className="carousel-container">
                <div className="movies">
                    {visibleHorrorMovie.map(movie => (
                        <div className="horror-movie" key={movie.id}>
                            <img src={`https://image.tmdb.org/t/p/original${movie.poster_path}`} alt="" style={{ width: '200px', height: '300px'}} />
                            <div className="vote-text">{movie.vote_average * 10}% Rating</div>
                            <div className="movie-title">{movie.original_title ? movie.original_title : movie.original_name}</div>
                        </div>
                    ))}
                </div>
                <div className="navigation">
                    {currentHorrorPage > 0 && (
                        <button className="prev-button" onClick={prevHorrorClick}>
                            <KeyboardArrowLeftIcon />
                        </button>
                    )}
                    {currentHorrorPage < Math.ceil(horrorMovie.length / itemPerPage) - 1 && (
                        <button className="next-button" onClick={nextHorrorClick} style={{ right: 0}}>
                            <KeyboardArrowRightIcon />
                        </button>
                    )}
                </div>
            </div>
            <Typography variant="h2">Science Fiction</Typography>
            <div className="carousel-container">
                <div className="movies">
                    {visibleSFMovie.map(movie => (
                        <div className="scienceFiction-movie" key={movie.id}>
                            <img src={`https://image.tmdb.org/t/p/original${movie.poster_path}`} alt="" style={{ width: '200px', height: '300px'}} />
                            <div className="vote-text">{movie.vote_average * 10}% Rating</div>
                            <div className="movie-title">{movie.original_title}</div>
                        </div>
                    ))}
                </div>
                <div className="navigation">
                    {currentSFPage > 0 && (
                        <button className="prev-button" onClick={prevSFClick}>
                            <KeyboardArrowLeftIcon />
                        </button>
                    )}
                    {currentSFPage < Math.ceil(scienceFictionMovies.length / itemPerPage) - 1 && (
                        <button className="next-button" onClick={nextSFClick} style={{ right: 0}}>
                            <KeyboardArrowRightIcon />
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Home;