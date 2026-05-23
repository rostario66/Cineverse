import api from "./client";
import type { Movie, MovieSearchResult } from "../types";

export const moviesApi = {
    getPopular: (page = 1) => 
        api.get<MovieSearchResult>(`/movies/popular?page=${page}`),

    search: (query: string, page = 1) => 
        api.get<MovieSearchResult>(`/movies/search?query=${encodeURIComponent(query)}&page=${page}`),

    getById: (id: number) => 
        api.get<Movie>(`movies/${id}`)
};
