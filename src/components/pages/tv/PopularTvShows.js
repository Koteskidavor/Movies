import MediaListPage from "../../common/MediaListPage";
import { getPopularTvShows, discoverTvShows } from "../../../api/tmdb";
import { TV_GENRES } from "../../../constants/genres";

const PopularTvShows = () => (
  <MediaListPage
    fetchFn={getPopularTvShows}
    discoverFn={discoverTvShows}
    genres={TV_GENRES}
    pageTitle="Popular TV Shows"
    itemLabel="popular shows"
    mediaType="tv"
  />
);

export default PopularTvShows;
