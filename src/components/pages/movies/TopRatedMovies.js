import MediaListPage from "../../common/MediaListPage";
import { getTopRatedMovies, discoverMovies } from "../../../api/tmdb";
import { MOVIE_GENRES } from "../../../constants/genres";

const TopRatedMovies = () => (
  <MediaListPage
    fetchFn={getTopRatedMovies}
    discoverFn={discoverMovies}
    genres={MOVIE_GENRES}
    pageTitle="Top Rated Movies"
    itemLabel="top rated movies"
    mediaType="movie"
  />
);

export default TopRatedMovies;
