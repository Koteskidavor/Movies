import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import FilterMovies from "./components/FilterMovies";
import FilterTvShows from "./components/FilterTvShows";
import PopularMovies from "./components/PopularMovies";
import PopularTvShows from "./components/PopularTvShows";
import TopRatedMovies from "./components/TopRatedMovies";
import TopRTv from "./components/TopRTv";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/PopularMovies" element={<PopularMovies />} />
        <Route path="/SearchMovies" element={<FilterMovies />} />
        <Route path="/SearchTvShows" element={<FilterTvShows />} />
        <Route path="/PopularTvShows" element={<PopularTvShows />} />
        <Route path="/TopRatedMovies" element={<TopRatedMovies />} />
        <Route path="/TopRatedTvShows" element={<TopRTv />} />
        <Route path="/*" element={<PopularMovies />} />
      </Routes>
    </Router>
  );
}

export default App;
