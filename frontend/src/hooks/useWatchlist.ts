import { watchlistApi } from "../api/watchlist";
import { useFetch } from "./useFetch";
import type { WatchlistItem } from "../types";

export function useMyWatchlist() {
    const { data, isLoading, setData } = useFetch<WatchlistItem[]>(
        () => watchlistApi.getMy(),
        []
    );

    const items = data ?? [];
    
    const watchlistIds = items.filter(w => !w.isWatched).map(w => w.tmdbMovieId);
    const watchedIds = items.filter(w => w.isWatched).map(w => w.tmdbMovieId);

    return {
        items,
        watchlistIds,
        watchedIds,
        isLoading,
        setData
    };
}