import { Link } from 'react-router-dom';
import type { Movie } from '../../types';
import CircleRating from '../ui/CircleRating';

interface MovieCardProps {
    movie: Movie;
    size?: 'sm' | 'md' | 'lg';
}

export default function MovieCard({ movie, size = 'md' }: MovieCardProps) {
    const sizes = {
        sm: 'w-32 h-48',
        md: 'w-44 h-64',
        lg: 'w-56 h-80',
    };

    return (
        <Link to={`/movies/${movie.id}`} className="group/card shrink-0">
            <div className={`${sizes[size]} relative rounded-xl overflow-hidden`}>
                {movie.posterPath ? (
                    <img
                        src={movie.posterPath}
                        alt={movie.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover/card:scale-105"
                    />
                ) : (
                    <div className="w-full h-full bg-white/5 flex items-center justify-center">
                        <span className="text-gray-600 text-xs">No poster</span>
                    </div>
                )}

                {/* Оверлей при ховере */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                    <p className="text-white text-sm font-medium line-clamp-2">{movie.title}</p>
                    <CircleRating
                        rating={movie.voteAverage}
                        variant="compact"
                        size="sm"
                        showNumber
                    />
                </div>
            </div>

            {/* Название под постером */}
            <p className="text-gray-400 text-xs mt-2 line-clamp-1 group-hover/card:text-white transition-colors">
                {movie.title}
            </p>
        </Link>
    );
}