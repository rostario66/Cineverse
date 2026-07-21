import { useSearchParams } from 'react-router-dom';
import { useMovieSearch } from '../hooks/useMovies';
import MovieCard from '../components/ui/MovieCard';

export default function SearchPage() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') ?? '';

    const { results, isLoading } = useMovieSearch(query);

    return (
        <div className="px-10 py-8">
            <h1 className="text-2xl font-bold text-white mb-2">
                Search results
            </h1>
            <p className="text-gray-500 text-sm mb-8">
                {query ? `Showing results for "${query}"` : 'Enter a query to search'}
            </p>

            {isLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className="h-64 bg-white/5 rounded-xl animate-pulse" />
                    ))}
                </div>
            ) : results.length === 0 ? (
                <p className="text-gray-500 text-sm py-8">
                    {query ? `Nothing found for "${query}"` : ''}
                </p>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {results.map(movie => (
                        <MovieCard key={movie.id} movie={movie} size="md" />
                    ))}
                </div>
            )}
        </div>
    );
}