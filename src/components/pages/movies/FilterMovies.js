import { useCallback } from "react";
import MediaListPage from "../../common/MediaListPage";
import { discoverMovies } from "../../../api/tmdb";
import { MOVIE_GENRES } from "../../../constants/genres";

const FilterMovies = () => {
  const fetchFn = useCallback((page) => discoverMovies({ page }), []);
  return (
    <MediaListPage
      fetchFn={fetchFn}
      discoverFn={discoverMovies}
      genres={MOVIE_GENRES}
      pageTitle="Movies"
      itemLabel="movies"
      mediaType="movie"
    />
  );
};

export default FilterMovies;
