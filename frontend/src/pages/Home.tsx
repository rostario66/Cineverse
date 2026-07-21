import { useNavigate } from 'react-router-dom';
import { usePopularMovies } from '../hooks/useMovies';
import HeroSection from '../components/home/HeroSection';
import TrendingSection from '../components/home/TrendingSection';

export default function Home() {
    const { movies: popular, isLoading } = usePopularMovies();
    const featuredMovie = popular[0];

    return (
        <div className="min-h-screen">
            {featuredMovie && !isLoading && (
                <HeroSection movie={featuredMovie} />
            )}
            <TrendingSection movies={popular} isLoading={isLoading} />
        </div>
    );
}