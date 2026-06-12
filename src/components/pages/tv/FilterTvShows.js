import { useCallback } from "react";
import MediaListPage from "../../common/MediaListPage";
import { discoverTvShows } from "../../../api/tmdb";
import { TV_GENRES } from "../../../constants/genres";

const FilterTvShows = () => {
  const fetchFn = useCallback((page) => discoverTvShows({ page }), []);
  return (
    <MediaListPage
      fetchFn={fetchFn}
      discoverFn={discoverTvShows}
      genres={TV_GENRES}
      pageTitle="TV Shows"
      itemLabel="shows"
      mediaType="tv"
    />
  );
};

export default FilterTvShows;
