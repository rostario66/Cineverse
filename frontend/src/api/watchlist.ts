import api from "./client";
import type { WatchlistItem } from "../types";

export const watchlistApi = {
    getMy: () => 
        api.get<WatchlistItem[]>(`/watchlist`),

    checkStatus: (tmdbMovieId: number) =>
        api.get<{ isInWatchlist: boolean }>(`/watchlist/${tmdbMovieId}/status`),
    
    add: (tmdbMovieId: number) => 
        api.post<WatchlistItem>('/watchlist', { tmdbMovieId }),

    markWatched: (itemId: number) =>
        api.patch(`/watchlist/${itemId}/watched`),

    remove: (itemId: string) => 
        api.delete(`/watchlist/${itemId}`),

    removeByMovieId: (tmdbMovieId: number) =>
        api.delete(`/watchlist/movie/${tmdbMovieId}`),
}