import { useEffect, useState } from "react";
import { moviesApi } from "../../api/movies";
import type { Movie } from "../../types";
import MovieCard from "../ui/MovieCard";

interface MovieGridFromIdsProps {
    tmdbIds: number[],
    emptyMessage: string
}

export default function MovieGridFromIds({ tmdbIds, emptyMessage }: MovieGridFromIdsProps) {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (tmdbIds.length == 0) {
            setMovies([]);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);

        Promise.all(tmdbIds.map(id => moviesApi.getById(id).catch(() => null)))
            .then(results => {
                setMovies(results.filter((m): m is Movie => m !== null));
            })
            .finally(() => setIsLoading(false));
    }, [tmdbIds.join(",")]);

    if (isLoading) {
        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-64 bg-white/5 rounded-xl animate-pulse" />
                ))}
            </div>
        );
    }

    if (movies.length === 0) {
        return <p className="text-gray-500 text-sm py-8 text-center">{emptyMessage}</p>;
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {movies.map(movie => (
                <MovieCard key={movie.id} movie={movie} size="md" />
            ))}
        </div>
    );
}