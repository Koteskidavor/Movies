import MediaListPage from "../../common/MediaListPage";
import { getPopularMovies, discoverMovies } from "../../../api/tmdb";
import { MOVIE_GENRES } from "../../../constants/genres";

const PopularMovies = () => (
  <MediaListPage
    fetchFn={getPopularMovies}
    discoverFn={discoverMovies}
    genres={MOVIE_GENRES}
    pageTitle="Popular Movies"
    itemLabel="popular movies"
    mediaType="movie"
  />
);

export default PopularMovies;
