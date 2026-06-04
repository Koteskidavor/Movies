import axios from "axios";

const API_KEY = process.env.REACT_APP_TMDB_API_AUTH;
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

const tmdb = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

export const getImageUrl = (path, size = "original") => {
  if (!path) return null;
  return `${IMAGE_BASE_URL}/${size}${path}`;
};

export const getPopularMovies = (page = 1) =>
  tmdb.get("/movie/popular", { params: { page } });

export const getPopularTvShows = (page = 1) =>
  tmdb.get("/tv/popular", { params: { page } });

export const getTopRatedMovies = (page = 1) =>
  tmdb.get("/movie/top_rated", { params: { page } });

export const getTopRatedTvShows = (page = 1) =>
  tmdb.get("/tv/top_rated", { params: { page } });

export const discoverMovies = (params = {}, options = {}) =>
  tmdb.get("/discover/movie", { params, ...options });

export const discoverTvShows = (params = {}, options = {}) =>
  tmdb.get("/discover/tv", { params, ...options });

export const searchMovies = (query, page = 1) =>
  tmdb.get("/search/movie", { params: { query, page } });

export const searchTvShows = (query, page = 1) =>
  tmdb.get("/search/tv", { params: { query, page } });

export const getMovieDetails = (id) =>
  tmdb.get(`/movie/${id}`);

export const getMovieCredits = (id) =>
  tmdb.get(`/movie/${id}/credits`);

export const getTvShowDetails = (id) =>
  tmdb.get(`/tv/${id}`);

export const getTvShowCredits = (id) =>
  tmdb.get(`/tv/${id}/credits`);

export default tmdb;
