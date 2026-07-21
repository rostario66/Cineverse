import { moviesApi } from "../api/movies";
import { useFetch } from "./useFetch";
import type { Genre } from "../types";

export function useGenres() {
    const { data: genres, isLoading } = useFetch<Genre[]>(
        () => moviesApi.getGenres(),
        []
    );

    return { genres: genres ?? [], isLoading };
}