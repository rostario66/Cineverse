import { likesApi } from "../api/likes";
import { useFetch } from "./useFetch";

interface LikeItem {
    id: string,
    tmdbMovieId: number,
    createdAt: string;
}

export function useMyLikes() {
    const { data, isLoading } = useFetch<LikeItem[]> (
        () => likesApi.getMy(),
        []
    );

    return {
        likes: data ?? [],
        likedIds: data?.map(l => l.tmdbMovieId) ?? [],
        isLoading
    };
}