import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import ErrorBoundary from "./components/common/ErrorBoundary";
import Spinner from "./components/common/Spinner";

const FilterMovies = lazy(() => import("./components/pages/movies/FilterMovies"));
const FilterTvShows = lazy(() => import("./components/pages/tv/FilterTvShows"));
const PopularMovies = lazy(() => import("./components/pages/movies/PopularMovies"));
const PopularTvShows = lazy(() => import("./components/pages/tv/PopularTvShows"));
const TopRatedMovies = lazy(() => import("./components/pages/movies/TopRatedMovies"));
const TopRatedTvShows = lazy(() => import("./components/pages/tv/TopRatedTvShows"));
const MediaBySlug = lazy(() => import("./components/common/MediaBySlug"));

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Navbar />
      <main>
        <ErrorBoundary name="movies" title="Movies App Error" message="Something went wrong. Please reload the page.">
          <Suspense fallback={<div style={{ display: "flex", justifyContent: "center", padding: 60 }}><Spinner /></div>}>
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
          </Suspense>
        </ErrorBoundary>
      </main>
    </Router>
  );
}

export default App;
