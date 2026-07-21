import { useState, useEffect } from 'react';
import { moviesApi } from '../api/movies';
import { useFetch } from './useFetch';
import type { Movie, MovieSearchResult } from '../types';

export function usePopularMovies(page = 1, genreId?: number) {
    const { data, isLoading, error } = useFetch<MovieSearchResult>(
        () => moviesApi.getPopular(page, genreId),
        [page, genreId]
    );

    return {
        movies: data?.movies ?? [],
        totalPages: data?.totalPages ?? 0,
        isLoading,
        error,
    };
}

export function useMovie(tmdbId: number) {
    const { data: movie, isLoading, error } = useFetch<Movie>(
        () => moviesApi.getById(tmdbId),
        [tmdbId]
    );

    return { movie, isLoading, error };
}

export function useMovieSearch(query: string) {
    const [results, setResults] = useState<Movie[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        setIsLoading(true);
        const timer = setTimeout(() => {
            moviesApi.search(query)
                .then(data => setResults(data.movies))
                .catch(console.error)
                .finally(() => setIsLoading(false));
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    return { results, isLoading };
}