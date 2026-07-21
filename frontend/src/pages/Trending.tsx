import { useState } from "react";
import { usePopularMovies } from "../hooks/useMovies";
import { useGenres } from "../hooks/useGenres";
import MovieCard from "../components/ui/MovieCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Trending() {
    const [page, setPage] = useState(1);
    const [selectedGenre, setSelectedGenre] = useState<number | undefined>();

    const { genres } = useGenres();
    const { movies, totalPages, isLoading } = usePopularMovies(page, selectedGenre);

    const handleGenreChange = (genreid: number | undefined) => {
        setSelectedGenre(genreid);
        setPage(1);
    };

     return (
        <div className="px-10 py-8">
            {/* Заголовок */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Trending Movies</h1>
                <p className="text-gray-500 text-sm">
                    Discover what's popular in cinema right now
                </p>
            </div>

            {/* Фильтр по жанрам */}
            <div className="flex flex-wrap gap-2 mb-8">
                <button
                    onClick={() => handleGenreChange(undefined)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        !selectedGenre
                            ? 'bg-cyan-500 text-black'
                            : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                    }`}
                >
                    All
                </button>
                {genres.map(genre => (
                    <button
                        key={genre.id}
                        onClick={() => handleGenreChange(genre.id)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                            selectedGenre === genre.id
                                ? 'bg-cyan-500 text-black'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                        }`}
                    >
                        {genre.name}
                    </button>
                ))}
            </div>

            {/* Сетка фильмов */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
                {isLoading
                    ? Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="h-64 bg-white/5 rounded-xl animate-pulse" />
                    ))
                    : movies.map(movie => (
                        <MovieCard key={movie.id} movie={movie} size="md" />
                    ))
                }
            </div>

            {/* Пагинация */}
            {!isLoading && movies.length > 0 && (
                <div className="flex items-center justify-center gap-4">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="flex items-center gap-1 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm transition-all"
                    >
                        <ChevronLeft size={16} />
                        Previous
                    </button>

                    <span className="text-gray-400 text-sm">
                        Page {page} of {Math.min(totalPages, 500)}
                    </span>

                    <button
                        onClick={() => setPage(p => p + 1)}
                        disabled={page >= totalPages}
                        className="flex items-center gap-1 bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm transition-all"
                    >
                        Next
                        <ChevronRight size={16} />
                    </button>
                </div>
            )}
        </div>
    );
}