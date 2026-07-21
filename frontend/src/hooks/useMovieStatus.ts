import { likesApi } from "../api/likes";
import { watchlistApi } from "../api/watchlist";
import { useAuth } from "../context/AuthContext";
import { useFetch } from "./useFetch";

interface MovieStatus {
    isLiked: boolean,
    inWatchlist: boolean;
}

export function useMovieStatus(tmdbId: number) {
    const { isAuthenticated } = useAuth();

    const { data, setData } = useFetch<MovieStatus>(
        async () => {
            if (!isAuthenticated) {
                return { isLiked: false, inWatchlist: false };
            }

            const [like, wl] = await Promise.all([
                likesApi.checkStatus(tmdbId),
                watchlistApi.checkStatus(tmdbId),
            ]);

            return {
                isLiked: like.isLiked,
                inWatchlist: wl.isInWatchlist,
            };
        },
        [tmdbId, isAuthenticated]
    );

    const setIsLiked = (value: boolean) => {
        setData(prev => prev ? {...prev, isLiked: value} : null)
    };

    const setInWatchlist = (value: boolean) => {
        setData(prev => prev ? {...prev, inWatchlist: value} : null)
    };

    return {
        isLiked: data?.isLiked ?? false,
        inWatchlist: data?.inWatchlist ?? false,
        setIsLiked,
        setInWatchlist
    };
}   