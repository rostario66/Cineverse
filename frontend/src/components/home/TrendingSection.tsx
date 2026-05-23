import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Movie } from '../../types';
import MovieCard from '../ui/MovieCard';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

interface TrendingSectionProps {
    movies: Movie[];
    isLoading: boolean;
}

export default function TrendingSection({ movies, isLoading }: TrendingSectionProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    // Проверяем где находится скролл
    const checkScroll = () => {
        if (!scrollRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    };

    // Проверка при загрузке и при изменении размера окна
    useEffect(() => {
        checkScroll();
        window.addEventListener('resize', checkScroll);
        return () => window.removeEventListener('resize', checkScroll);
    }, [movies]);

    const scroll = (direction: 'left' | 'right') => {
        if (!scrollRef.current) return;
        // Скроллим на ширину 3 карточек
        const scrollAmount = 192 * 3; // 192 = w-44 (44 * 4)
        scrollRef.current.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth',
        });
    };

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

            {/* Контейнер со стрелками */}
            <div className="relative group/section">
                {/* Стрелка влево */}
                {canScrollLeft && (
                    <button
                        onClick={() => scroll('left')}
                        aria-label="Scroll left"
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white p-2 rounded-full shadow-lg opacity-0 group-hover/section:opacity-100 transition-opacity"
                    >
                        <ChevronLeft size={20} />
                    </button>
                )}

                {/* Стрелка вправо */}
                {canScrollRight && (
                    <button
                        onClick={() => scroll('right')}
                        aria-label="Scroll right"
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 text-white p-2 rounded-full shadow-lg opacity-0 group-hover/section:opacity-100 transition-opacity"
                    >
                        <ChevronRight size={20} />
                    </button>
                )}

                {/* Скролл-контейнер */}
                <div className="w-full overflow-hidden">
                    <div
                        ref={scrollRef}
                        onScroll={checkScroll}
                        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
                        style={{ scrollbarWidth: 'none' }}
                    >
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
                    </div>
                </div>
            </div>
        </div>
    );
}