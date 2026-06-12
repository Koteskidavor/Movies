import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { searchMovies, searchTvShows, getImageUrl } from "../../api/tmdb";
import { getRatingColor } from "../../utils/helpers";
import "./Navbar.css";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState("movies");
  const [activeSub, setActiveSub] = useState("popular");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [activeResultIndex, setActiveResultIndex] = useState(-1);
  const searchRef = useRef(null);
  const debounceRef = useRef(null);
  const latestQueryRef = useRef("");

  useEffect(() => {
    const path = location.pathname;

    const isTv =
      path === "/TvShow" ||
      path === "/PopularTvShows" ||
      path === "/TopRatedTvShows" ||
      path.startsWith("/TvShow/");
    setActiveSection(isTv ? "tvShows" : "movies");

    if (path === "/PopularMovies") setActiveSub("popularMovie");
    else if (path === "/TopRatedMovies") setActiveSub("topRatedMovie");
    else if (path === "/PopularTvShows") setActiveSub("popularTvShow");
    else if (path === "/TopRatedTvShows") setActiveSub("topRatedTvShow");
    else setActiveSub("");
  }, [location]);

  useEffect(() => {
    if (searchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [searchOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      const wrapper = document.querySelector(".search-wrapper");
      if (searchOpen && wrapper && !wrapper.contains(e.target)) {
        setSearchOpen(false);
        setSearchQuery("");
        setSearchResults([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchOpen]);

  useEffect(() => {
    setActiveResultIndex(-1);
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    const query = searchQuery.trim();
    latestQueryRef.current = query;

    debounceRef.current = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const fn = activeSection === "movies" ? searchMovies : searchTvShows;
        const { data } = await fn(query);
        if (latestQueryRef.current !== query) return;
        setSearchResults(data.results.slice(0, 6));
      } catch {
        if (latestQueryRef.current !== query) return;
        setSearchResults([]);
      } finally {
        if (latestQueryRef.current === query) setSearchLoading(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery, activeSection]);

  const handleSectionClick = (section) => {
    if (section === "movies") {
      navigate("/Movies");
    } else {
      navigate("/TvShow");
    }
  };

  const handleSearchToggle = () => {
    setSearchOpen((prev) => !prev);
    if (searchOpen) {
      setSearchQuery("");
      setSearchResults([]);
    }
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveResultIndex((prev) => (prev < searchResults.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveResultIndex((prev) => (prev > 0 ? prev - 1 : searchResults.length - 1));
    } else if (e.key === "Enter") {
      if (activeResultIndex >= 0 && searchResults[activeResultIndex]) {
        selectResult(searchResults[activeResultIndex]);
      } else if (searchQuery.trim()) {
        const path = activeSection === "movies" ? "/Movies" : "/TvShow";
        navigate(path);
        closeSearch();
      }
    } else if (e.key === "Escape") {
      closeSearch();
    }
  };

  const selectResult = (item) => {
    const isSame =
      (activeSection === "movies" && location.pathname !== "/TvShow" && !location.pathname.includes("Tv")) ||
      (activeSection === "tvShows" && (location.pathname === "/TvShow" || location.pathname.includes("Tv")));
    if (isSame) {
      const modalType = activeSection === "movies" ? "movie" : "tv";
      navigate(location.pathname, { state: { openModalItem: item, openModalType: modalType } });
    } else {
      const path = activeSection === "movies" ? "/Movies" : "/TvShow";
      navigate(path, { state: { openModalItem: item, openModalType: activeSection === "movies" ? "movie" : "tv" } });
    }
    closeSearch();
  };

  const closeSearch = () => {
    setSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  const movieSubLinks = [
    { label: "Popular", to: "/PopularMovies", key: "popularMovie" },
    { label: "Top Rated", to: "/TopRatedMovies", key: "topRatedMovie" },
  ];

  const tvSubLinks = [
    { label: "Popular", to: "/PopularTvShows", key: "popularTvShow" },
    { label: "Top Rated", to: "/TopRatedTvShows", key: "topRatedTvShow" },
  ];

  const subLinks = activeSection === "movies" ? movieSubLinks : tvSubLinks;

  return (
    <div className="navbar-wrapper">
      <div className="navbar-inner">
        <div className="navbar-brand">Movies</div>

        <nav className="navbar-tabs" aria-label="Content type">
          <button
            className={`nav-item ${activeSection === "movies" ? "active" : ""}`}
            onClick={() => handleSectionClick("movies")}
          >
            Movies
          </button>
          <button
            className={`nav-item ${activeSection === "tvShows" ? "active" : ""}`}
            onClick={() => handleSectionClick("tvShows")}
          >
            TV Shows
          </button>
        </nav>

        <div className="navbar-right">
          <div className={`search-wrapper ${searchOpen ? "open" : ""}`}>
            {searchOpen && (
              <input
                ref={searchRef}
                type="text"
                className="navbar-search-input"
                placeholder={`Search ${activeSection === "movies" ? "movies" : "TV shows"}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
              />
            )}
            <button
              className="search-btn"
              onClick={handleSearchToggle}
              aria-label="Search"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>

            {searchOpen && searchQuery.trim() && (
              <div className="search-dropdown">
                {searchLoading ? (
                  <div className="search-dropdown-loading">Searching...</div>
                ) : searchResults.length > 0 ? (
                  searchResults.map((item, index) => {
                    const percentage = item.vote_average * 10;
                    const strokeColor = getRatingColor(percentage);
                    const title = item.title || item.name;
                    const date = item.release_date || item.first_air_date;
                    const year = date ? date.slice(0, 4) : "";
                    return (
                      <div
                        key={item.id}
                        className={`search-result-item ${activeResultIndex === index ? "active" : ""}`}
                        role="button"
                        tabIndex={0}
                        onClick={() => selectResult(item)}
                        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); selectResult(item); } }}
                      >
                        <img
                          src={getImageUrl(item.poster_path, "w92")}
                          alt={title}
                          className="search-result-poster"
                        />
                        <div className="search-result-info">
                          <div className="search-result-title">{title}</div>
                          <div className="search-result-meta">
                            {year && <span>{year}</span>}
                            <span
                              className="search-result-rating"
                              style={{ color: strokeColor }}
                            >
                              {percentage.toFixed(0)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="search-dropdown-empty">
                    No results found
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="navbar-subnav">
        {subLinks.map((link) => (
          <Link
            key={link.key}
            to={link.to}
            className={`subnav-item ${activeSub === link.key ? "active" : ""}`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Navbar;
