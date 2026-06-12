import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import FilterMovies from "./components/pages/movies/FilterMovies";
import FilterTvShows from "./components/pages/tv/FilterTvShows";
import PopularMovies from "./components/pages/movies/PopularMovies";
import PopularTvShows from "./components/pages/tv/PopularTvShows";
import TopRatedMovies from "./components/pages/movies/TopRatedMovies";
import TopRatedTvShows from "./components/pages/tv/TopRatedTvShows";
import MediaBySlug from "./components/common/MediaBySlug";
import ErrorBoundary from "./components/common/ErrorBoundary";

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Navbar />
      <main>
        <ErrorBoundary name="movies" title="Movies App Error" message="Something went wrong. Please reload the page.">
          <Routes>
            <Route path="/Movies" element={<FilterMovies />} />
            <Route path="/TvShows" element={<FilterTvShows />} />
            <Route path="/Movie/:slug" element={<MediaBySlug mediaType="Movie" />} />
            <Route path="/TvShow/:slug" element={<MediaBySlug mediaType="TvShow" />} />
            <Route path="/" element={<Navigate to="/Movies" replace />} />
            <Route path="/PopularMovies" element={<PopularMovies />} />
            <Route path="/PopularTvShows" element={<PopularTvShows />} />
            <Route path="/TopRatedMovies" element={<TopRatedMovies />} />
            <Route path="/TopRatedTvShows" element={<TopRatedTvShows />} />
            <Route path="*" element={<Navigate to="/Movies" replace />} />
          </Routes>
        </ErrorBoundary>
      </main>
    </Router>
  );
}

export default App;
