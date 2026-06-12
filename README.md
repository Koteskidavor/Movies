# Movies — TMDB Film & TV Browser

A responsive single-page application for browsing, discovering, and searching movies and TV shows powered by [The Movie Database (TMDB) API](https://developers.themoviedb.org/3). Built with React 18 and React Router 6.

## Features

- **Browse curated lists** — Popular and Top Rated sections for both movies and TV shows
- **Genre filtering** — Filter any list by genre using union (AND) logic via TMDB's discover endpoint; multiple genres are joined together for precise results
- **Full-text search** — Debounced navbar search with keyboard navigation (arrow keys + Enter), scoped to the active section (movies or TV)
- **Detail modal** — Click any card to open a modal with full metadata: synopsis, cast (top 6), runtime, budget/revenue or seasons/episodes, tagline, and rating
- **Direct slug routing** — Shareable URLs like `/Movie/the-dark-knight` that resolve via search and open the detail modal
- **Responsive grid** — Fluid 5-column layout down to 2 columns on mobile
- **Rating badges** — Color-coded SVG circular badges (green ≥ 70%, amber ≥ 50%, red < 50%)
- **Accessibility** — ARIA labels on interactive elements, keyboard navigation for search/genres/modal, focus trapping inside modal, `sr-only` utility class
- **Error boundaries** — Graceful error handling at the route and component level

## Tech Stack

| Library | Version | Purpose |
|---------|---------|---------|
| [React](https://reactjs.org/) | ^18.2.0 | UI framework with automatic JSX transform |
| [React Router](https://reactrouter.com/) | ^6.28.0 | Client-side routing with modal state via `location.state` |
| [axios](https://axios-http.com/) | ^1.7.0 | HTTP client for TMDB v3 REST API |
| [Create React App](https://create-react-app.dev/) | 5.0.1 | Build tooling (webpack, Babel, ESLint) |
| [TMDB API](https://developers.themoviedb.org/3) | v3 | Data source for movies, TV shows, images, credits |

## Architecture

```
src/
├── api/
│   └── tmdb.js            # Axios instance, all TMDB endpoint wrappers
├── constants/
│   └── genres.js           # MOVIE_GENRES (19) and TV_GENRES (16)
├── hooks/
│   ├── useGenreFilteredList.js   # Discover fetch with AbortController & pagination
│   └── useModalRouter.js         # Modal open/close via location.state + popstate
├── utils/
│   └── helpers.js          # getRatingColor, formatDate, formatReleaseDate
├── components/
│   ├── common/
│   │   ├── MediaListPage.js      # Shared page driver (fetch, genre, pagination, modal)
│   │   ├── MediaCard.js          # Poster card with rating badge
│   │   ├── MediaModal.js         # Detail modal with cast, info, backdrop
│   │   ├── MediaBySlug.js        # Slug → search → redirect with modal state
│   │   ├── GenreFilter.js        # Scrollable genre pill row with AND toggle
│   │   ├── Pagination.js         # Page controls with windowed page numbers
│   │   ├── ErrorBoundary.js      # React error boundary wrapper
│   │   └── Spinner.js            # CSS-animated loading spinner
│   ├── layout/
│   │   └── Navbar.js             # Section tabs, sub-navigation, search with dropdown
│   └── pages/
│       ├── movies/
│       │   ├── FilterMovies.js   # /Movies — discover with no preset
│       │   ├── PopularMovies.js  # /PopularMovies
│       │   └── TopRatedMovies.js # /TopRatedMovies
│       └── tv/                   # Mirrors movies/ structure
│           ├── FilterTvShows.js
│           ├── PopularTvShows.js
│           └── TopRatedTvShows.js
├── App.js                 # BrowserRouter + route definitions
├── index.js               # App entry point
├── index.css              # Global styles, keyframes, .sr-only
└── App.css                # (empty — reserved for future global styles)
```

**Why this structure:**

- **API layer is isolated** — `api/tmdb.js` is the only file that knows about TMDB's base URL, auth, and endpoints. If the API provider changes, only this file needs updating.
- **Hooks encapsulate complex logic** — `useGenreFilteredList` owns all discover-fetch orchestration (AbortController, page clamping, genre state keying), and `useModalRouter` owns all modal state management via `location.state`. Components stay thin and declarative.
- **Shared page driver** — `MediaListPage` is a single reusable component that drives all 6 route pages via props (`fetchFn`, `discoverFn`, `genres`, `itemLabel`, `mediaType`). Each page component is a 5–10 line wrapper.
- **Mirrored movie/TV structure** — Pages are organized by media type under `pages/movies/` and `pages/tv/` with identical file names, making it clear when a change needs to be applied to both.
- **CSS co-located** — Each major component has its own `.css` file imported directly, avoiding a monolithic stylesheet.

## Setup

1. Clone the repository.
2. Create a `.env` file in the project root:
   ```
   REACT_APP_TMDB_API_AUTH=your_tmdb_api_read_access_token
   ```
   Get a token at [https://www.themoviedb.org/settings/api](https://www.themoviedb.org/settings/api).
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm start
   ```
5. Open [http://localhost:3000](http://localhost:3000).

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start development server on port 3000 |
| `npm run build` | Production build to `build/` |
| `npm test` | Run test suite (Jest + React Testing Library) |

## Key Design Decisions

- **Genre filtering uses AND (union)** — Selected genre IDs are joined with commas in TMDB's `with_genres` parameter, returning items that belong to all selected genres. This gives precise filtering versus OR-based approaches.
- **Modal state via the router** — The modal opens and closes through `location.state` rather than local component state. This preserves scroll position, enables browser back-button to close the modal, and allows direct slug links to open the detail modal.
- **No external UI library** — All icons are inline SVGs, and styling is plain CSS. This keeps the bundle lean and removes dependency on heavy component libraries.
- **TMDB's 500-page cap** — TMDB limits all endpoints to 500 pages at 20 results each. The app clamps pagination to this limit at both the hook and component level.
- **AbortController for cleanup** — All fetch effects use `AbortController` to cancel in-flight requests when the component unmounts or dependencies change, preventing state updates on unmounted components.

## Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/` | Redirect → `/Movies` | Root redirects to movie browser |
| `/Movies` | FilterMovies | Browse all movies with genre filters |
| `/PopularMovies` | PopularMovies | TMDB's currently popular movies |
| `/TopRatedMovies` | TopRatedMovies | Highest-rated movies |
| `/TvShows` | FilterTvShows | Browse all TV shows with genre filters |
| `/PopularTvShows` | PopularTvShows | Currently popular TV shows |
| `/TopRatedTvShows` | TopRatedTvShows | Highest-rated TV shows |
| `/Movie/:slug` | MediaBySlug | Search → redirect to modal from shareable URL |
| `/TvShow/:slug` | MediaBySlug | Same for TV shows |
| `*` | Redirect → `/Movies` | Catch-all redirect |

## Performance

- Components are wrapped with `React.memo` to prevent unnecessary re-renders when props haven't changed
- Search input is debounced at 300ms to avoid excessive API calls
- Images use TMDB's responsive size presets (`w92`, `w185`, `w342`, `w500`, `w1280`)
- Cast images use `loading="lazy"` for deferred loading
- All fetch effects clean up with `AbortController`
- Scroll position is preserved when opening/closing the modal
