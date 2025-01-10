import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const [activeMenu, setActiveMenu] = useState("");
  const location = useLocation();
  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
  };
  useEffect(() => {
    if (location.pathname === "/PopularMovies") {
      setActiveMenu("popularM");
    } else if (location.pathname === "/TopRatedMovies") {
      setActiveMenu("TopRatedM");
    } else if (location.pathname === "/SearchMovies") {
      setActiveMenu("SearchMovies");
    } else if (location.pathname === "/PopularTvShows") {
      setActiveMenu("popularT");
    } else if (location.pathname === "/TopRatedTvShows") {
      setActiveMenu("topRT");
    } else if (location.pathname === "/SearchTvShows") {
      setActiveMenu("searchTv");
    } else {
      setActiveMenu("popularM");
    }
  }, [location]);
  return (
    <nav>
      <ul className="navbar">
        <li
          className={`nav-item ${activeMenu === "movies" ? "active" : ""}`}
          onClick={() => handleMenuClick("movies")}
        >
          Movies
          <ul
            className={`genre-dropdown ${
              activeMenu === "movies" ? "active" : ""
            }`}
            onClick={() => handleMenuClick("popularM")}
          >
            <Link to="/PopularMovies" style={{ textDecoration: "none" }}>
              <li className={activeMenu === "popularM" ? "activePopularM" : ""}>
                Popular
              </li>
            </Link>
            <Link to="/TopRatedMovies" style={{ textDecoration: "none" }}>
              <li
                className={activeMenu === "TopRatedM" ? "activeTopRM" : ""}
                onClick={() => handleMenuClick("TopRatedM")}
              >
                Top Rated
              </li>
            </Link>
            <Link to="/SearchMovies" style={{ textDecoration: "none" }}>
              <li
                className={activeMenu === "SearchMovies" ? "activeSearchM" : ""}
                onClick={() => handleMenuClick("SearchMovies")}
              >
                Search Movies
              </li>
            </Link>
          </ul>
        </li>
        <li
          className={`nav-item ${activeMenu === "tvShows" ? "active" : ""}`}
          onClick={() => handleMenuClick("tvShows")}
        >
          TV Shows
          <ul
            className={`genre-dropdown ${
              activeMenu === "tvShows" ? "active" : ""
            }`}
          >
            <Link to="/PopularMovies" style={{ textDecoration: "none" }}>
              <li
                className={activeMenu === "popularT" ? "activePopularT" : ""}
                onClick={() => handleMenuClick("popularT")}
              >
                Popular
              </li>
            </Link>
            <Link to="/TopRatedTvShows" style={{ textDecoration: "none" }}>
              <li
                className={activeMenu === "topRT" ? "activeTopRT" : ""}
                onClick={() => handleMenuClick("topRT")}
              >
                Top Rated
              </li>
            </Link>
            <Link to="/SearchTvShows" style={{ textDecoration: "none" }}>
              <li
                className={activeMenu === "searchTv" ? "activeSearchT" : ""}
                onClick={() => handleMenuClick("searchTv")}
              >
                Search Tv-Shows
              </li>
            </Link>
          </ul>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
