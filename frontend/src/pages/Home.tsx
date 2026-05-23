import { useState, useEffect } from 'react';
import type { Movie, MovieSearchResult } from '../types';
import { moviesApi } from '../api/movies';
import { watchlistApi } from '../api/watchlist';
import { useAuth } from '../context/AuthContext';
import HeroSection from '../components/home/HeroSection';
import TrendingSection from '../components/home/TrendingSection';
import { Search } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import MovieCard from '../components/ui/MovieCard';

export default function Home() {
    const [popular, setPopular] = useState<Movie[]>([]);
    const [searchResults, setSearchResults] = useState<Movie[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSearching, setIsSearching] = useState(false);
    const [query, setQuery] = useState('');
    const { isAuthenticated } = useAuth();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Загружаем популярные фильмы
    useEffect(() => {
        moviesApi.getPopular()
            .then((data: MovieSearchResult) => setPopular(data.movies))
            .catch(console.error)
            .finally(() => setIsLoading(false));
    }, []);

    // Поиск из URL параметра
    useEffect(() => {
        const searchQuery = searchParams.get('search');
        if (searchQuery) {
            setQuery(searchQuery);
            handleSearch(searchQuery);
        }
    }, [searchParams]);

    const handleSearch = async (q: string) => {
        if (!q.trim()) {
            setSearchResults([]);
            return;
        }
        setIsSearching(true);
        try {
            const data: MovieSearchResult = await moviesApi.search(q);
            setSearchResults(data.movies);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSearching(false);
        }
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        navigate(`/?search=${encodeURIComponent(query)}`);
    };

    const handleAddToWatchlist = async (movieId: number) => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        try {
            await watchlistApi.add(movieId);
        } catch (error) {
            console.error(error);
        }
    };

    const isSearchMode = query.trim().length > 0;
    const featuredMovie = popular[0];

    return (
        <div className="min-h-screen w-full overflow-x-hidden">
            {/* Поисковая строка сверху */}
            <div className="sticky top-0 z-40 bg-[#0d1117]/80 backdrop-blur-md border-b border-white/5 px-10 py-4">
                <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto relative">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                        type="text"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="Search movies, directors, or users..."
                        className="w-full bg-white/5 text-white placeholder-gray-500 pl-11 pr-4 py-3 rounded-xl outline-none focus:ring-1 focus:ring-cyan-500/50 text-sm"
                    />
                </form>
            </div>

            {isSearchMode ? (
                // Режим поиска
                <div className="px-10 py-8">
                    <h2 className="text-xl font-bold text-white mb-6">
                        Search results for "{query}"
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {isSearching
                            ? Array.from({ length: 12 }).map((_, i) => (
                                <div key={i} className="h-64 bg-white/5 rounded-xl animate-pulse" />
                            ))
                            : searchResults.map(movie => (
                                <MovieCard key={movie.id} movie={movie} />
                            ))
                        }
                    </div>
                </div>
            ) : (
                // Обычный режим
                <>
                    {/* Hero секция */}
                    {featuredMovie && !isLoading && (
                        <HeroSection
                            movie={featuredMovie}
                            onAddToWatchlist={handleAddToWatchlist}
                        />
                    )}

                    {/* Trending секция */}
                    <TrendingSection
                        movies={popular}
                        isLoading={isLoading}
                    />
                </>
            )}
        </div>
    );
}