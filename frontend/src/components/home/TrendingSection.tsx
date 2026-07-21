import { Link } from 'react-router-dom';
import type { Movie } from '../../types';
import MovieCard from '../ui/MovieCard';
import HorizontalScroll from '../ui/HorizontalScroll';
import { ArrowRight } from 'lucide-react';

interface TrendingSectionProps {
    movies: Movie[];
    isLoading: boolean;
}

export default function TrendingSection({ movies, isLoading }: TrendingSectionProps) {
    return (
        <div className="px-10 py-8">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-white">Trending This Week</h2>
                    <p className="text-gray-500 text-sm mt-1">
                        The most watched and reviewed films right now.
                    </p>
                </div>
                <Link
                    to="/trending"
                    className="flex items-center gap-1 text-cyan-400 text-sm hover:text-cyan-300 transition-colors"
                >
                    See All <ArrowRight size={16} />
                </Link>
            </div>

            <HorizontalScroll>
                {isLoading
                    ? Array.from({ length: 6 }).map((_, i) => (
                        <div
                            key={i}
                            className="w-44 h-64 bg-white/5 rounded-xl shrink-0 animate-pulse"
                        />
                    ))
                    : movies.map(movie => (
                        <MovieCard key={movie.id} movie={movie} size="md" />
                    ))
                }
            </HorizontalScroll>
        </div>
    );
}