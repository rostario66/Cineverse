import type { Movie } from '../../types';
import { Play, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import CircleRating from '../ui/CircleRating';

interface HeroSectionProps {
    movie: Movie;
    onAddToWatchlist: (movieId: number) => void;
}

export default function HeroSection({ movie, onAddToWatchlist }: HeroSectionProps) {
    return (
        <div className="relative w-full h-125 overflow-hidden">
            {movie.posterPath && (
                <div
                    className="absolute inset-0 bg-cover bg-center scale-110 blur-sm"
                    style={{ backgroundImage: `url(${movie.posterPath})` }}
                />
            )}

            <div className="absolute inset-0 bg-linear-to-r from-[#0d1117] via-[#0d1117]/80 to-transparent" />
            <div className="absolute inset-0 bg-linear-to-t from-[#0d1117] via-transparent to-transparent" />

            <div className="relative h-full flex flex-col justify-end px-10 pb-12">
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-0.5 bg-cyan-400" />
                    <span className="text-cyan-400 text-xs font-medium tracking-widest uppercase">
                        Featured Premiere
                    </span>
                </div>

                <h1 className="text-5xl font-black text-white uppercase tracking-tight mb-3">
                    {movie.title}
                </h1>

                {/* Метаданные с CircleRating вместо звезды */}
                <div className="flex items-center gap-4 mb-4 text-sm text-gray-300">
                    <span>{new Date(movie.releaseDate).getFullYear()}</span>
                    <span className="w-1 h-1 bg-gray-500 rounded-full" />
                    <CircleRating
                        rating={movie.voteAverage}
                        variant="compact"
                        size="sm"
                        showNumber
                    />
                    <span className="w-1 h-1 bg-gray-500 rounded-full" />
                    <span>{movie.genres.slice(0, 2).join(', ')}</span>
                </div>

                <p className="text-gray-400 text-sm max-w-lg mb-6 line-clamp-2">
                    {movie.overview}
                </p>

                <div className="flex items-center gap-3">
                    <Link
                        to={`/movies/${movie.id}`}
                        className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black px-6 py-3 rounded-xl font-semibold text-sm transition-all"
                    >
                        <Play size={16} fill="black" />
                        Watch Trailer
                    </Link>
                    <button
                        onClick={() => onAddToWatchlist(movie.id)}
                        className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all border border-white/10"
                    >
                        <Plus size={16} />
                        Add to Watchlist
                    </button>
                </div>
            </div>
        </div>
    );
}