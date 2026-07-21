import api from "./client";
import type { Movie, MovieSearchResult, Genre } from "../types";

export const moviesApi = {
    getPopular: (page = 1, genreId?: number) => {
        const params = new URLSearchParams({ page: String(page) });
        if (genreId) params.append("genreId", String(genreId));
        return api.get<MovieSearchResult>(`/movies/popular?${params}`);
    },

    getGenres: () => 
        api.get<Genre[]>(`/movies/genres`),

    search: (query: string, page = 1) => 
        api.get<MovieSearchResult>(`/movies/search?query=${encodeURIComponent(query)}&page=${page}`),

    getById: (id: number) => 
        api.get<Movie>(`movies/${id}`)
};
