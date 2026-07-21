import type { Movie } from '../../types';
import { Play, Plus, Check } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import CircleRating from '../ui/CircleRating';
import { useMovieStatus } from '../../hooks/useMovieStatus';
import { useAuth } from '../../context/AuthContext';
import { watchlistApi } from '../../api/watchlist';

interface HeroSectionProps {
    movie: Movie;
}

export default function HeroSection({ movie }: HeroSectionProps) {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { inWatchlist, setInWatchlist } = useMovieStatus(movie.id);

    const handleToggleWatchlist = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        try {
            if (inWatchlist) {
                await watchlistApi.removeByMovieId(movie.id);
                setInWatchlist(false);
            } else {
                await watchlistApi.add(movie.id);
                setInWatchlist(true);
            }
        } catch (error) {
            console.error(error);
        }
    };

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
                        onClick={handleToggleWatchlist}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all border ${
                            inWatchlist
                                ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400'
                                : 'bg-white/10 hover:bg-white/20 text-white border-white/10'
                        }`}
                    >
                        {inWatchlist ? <Check size={16} /> : <Plus size={16} />}
                        {inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
                    </button>
                </div>
            </div>
        </div>
    );
}