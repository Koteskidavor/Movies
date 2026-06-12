import { useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Spinner from "./Spinner";
import { searchMovies, searchTvShows } from "../../api/tmdb";

const cache = new Map();

const MediaBySlug = ({ mediaType }) => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.title = `${slug?.replace(/-/g, " ") || mediaType}`;
  }, [slug, mediaType]);

  useEffect(() => {
    if (!slug) {
      navigate(`/${mediaType === "movie" ? "Movies" : "TvShows"}`, { replace: true });
      return;
    }

    if (location.state?.openModalItem && location.state?.openModalType === mediaType) {
      const path = mediaType === "movie" ? "/Movies" : "/TvShows";
      navigate(path, { state: { openModalItem: location.state.openModalItem, openModalType: mediaType }, replace: true });
      return;
    }

    const cacheKey = `${slug}|${mediaType}`;
    const cached = cache.get(cacheKey);
    if (cached !== undefined) {
      if (cached) {
        const path = mediaType === "movie" ? "/Movies" : "/TvShows";
        navigate(path, { state: { openModalItem: cached, openModalType: mediaType }, replace: true });
      } else {
        navigate(`/${mediaType === "movie" ? "Movies" : "TvShows"}`, { replace: true });
      }
      return;
    }

    const query = slug.replace(/-/g, " ");
    const fn = mediaType === "movie" ? searchMovies : searchTvShows;

    let cancelled = false;
    (async () => {
      try {
        const { data } = await fn(query);
        if (cancelled) return;
        if (data.results?.length > 0) {
          const item = data.results[0];
          cache.set(cacheKey, item);
          const path = mediaType === "movie" ? "/Movies" : "/TvShows";
          navigate(path, { state: { openModalItem: item, openModalType: mediaType }, replace: true });
        } else {
          cache.set(cacheKey, null);
          navigate(`/${mediaType === "movie" ? "Movies" : "TvShows"}`, { replace: true });
        }
      } catch {
        if (!cancelled) navigate(`/${mediaType === "movie" ? "Movies" : "TvShows"}`, { replace: true });
      }
    })();

    return () => { cancelled = true; };
  }, [slug, mediaType, navigate, location.state]);

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 10, padding: "60px 30px", color: "#555", fontSize: 14 }}>
      <Spinner />
      <span>Searching for {slug?.replace(/-/g, " ")}...</span>
    </div>
  );
};

export default MediaBySlug;
