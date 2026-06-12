import MediaListPage from "../../common/MediaListPage";
import { getTopRatedTvShows, discoverTvShows } from "../../../api/tmdb";
import { TV_GENRES } from "../../../constants/genres";

const TopRatedTvShows = () => (
  <MediaListPage
    fetchFn={getTopRatedTvShows}
    discoverFn={discoverTvShows}
    genres={TV_GENRES}
    pageTitle="Top Rated TV Shows"
    itemLabel="top rated shows"
    mediaType="tv"
  />
);

export default TopRatedTvShows;
