import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { likesApi } from '../api/likes';
import { watchlistApi } from '../api/watchlist';
import { reviewsApi } from '../api/reviews';
import { useAuth } from '../context/AuthContext';
import { useMovie } from '../hooks/useMovies';
import { useMovieReviews } from '../hooks/useReviews';
import { useMovieStatus } from '../hooks/useMovieStatus';
import CircleRating from '../components/ui/CircleRating';
import ReviewForm from '../components/movie/ReviewForm';
import ReviewCard from '../components/movie/ReviewCard';
import MovieCard from '../components/ui/MovieCard';
import HorizontalScroll from '../components/ui/HorizontalScroll';
import { Play, Plus, Check, Heart, Share2 } from 'lucide-react';

export default function MoviePage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { isAuthenticated, userName } = useAuth();
    const tmdbId = Number(id);

    // Все данные через хуки
    const { movie, isLoading } = useMovie(tmdbId);
    const { reviews, addReview, removeReview } = useMovieReviews(tmdbId);
    const { isLiked, inWatchlist, setIsLiked, setInWatchlist } = useMovieStatus(tmdbId);

    const [showReviewForm, setShowReviewForm] = useState(false);

    const handleToggleWatchlist = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        try {
            if (inWatchlist) {
                await watchlistApi.removeByMovieId(tmdbId);
                setInWatchlist(false);
            } else {
                await watchlistApi.add(tmdbId);
                setInWatchlist(true);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleLike = async () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        try {
            if (isLiked) {
                await likesApi.unlike(tmdbId);
                setIsLiked(false);
            } else {
                await likesApi.like(tmdbId);
                setIsLiked(true);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleCreateReview = async (data: { rating: number; content: string }) => {
        const newReview = await reviewsApi.create({
            tmdbMovieId: tmdbId,
            ...data,
        });
        addReview(newReview);
        setShowReviewForm(false);
    };

    const handleDeleteReview = async (reviewId: string) => {
        try {
            await reviewsApi.delete(reviewId);
            removeReview(reviewId);
        } catch (error) {
            console.error(error);
        }
    };

    if (isLoading) {
        return (
            <div className="px-10 py-8">
                <div className="animate-pulse space-y-4">
                    <div className="h-96 bg-white/5 rounded-2xl" />
                </div>
            </div>
        );
    }

    if (!movie) {
        return <div className="px-10 py-8 text-gray-400">Movie not found</div>;
    }

    const hasUserReview = reviews.some(r => r.userName === userName);
    const year = new Date(movie.releaseDate).getFullYear();
    const runtimeText = movie.runtime > 0
        ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
        : '';

    // Дальше идёт твой существующий JSX, он не меняется
    // Только handleAddToWatchlist заменили на handleToggleWatchlist
    // И кнопке Heart добавили onClick={handleLike}
    return (
        <div className="min-h-screen">
            {/* Hero секция с backdrop изображением */}
            <div className="relative w-full h-[500px] -mt-px">
                {movie.backdropPath ? (
                    <img
                        src={movie.backdropPath}
                        alt={movie.title}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                ) : (
                    <div className="absolute inset-0 bg-white/5" />
                )}
                {/* Затемнение */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-[#0d1117]/60 to-transparent" />
            </div>

            {/* Контент перекрывает Hero снизу */}
            <div className="relative px-10 -mt-32">
                {/* Бейдж + метаданные */}
                <div className="flex items-center gap-3 mb-3 text-xs">
                    <span className="bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 px-3 py-1 rounded-full font-medium tracking-wider">
                        TRENDING
                    </span>
                    <span className="text-gray-300">{year}</span>
                    {runtimeText && (
                        <>
                            <span className="w-1 h-1 bg-gray-500 rounded-full" />
                            <span className="text-gray-300">{runtimeText}</span>
                        </>
                    )}
                </div>

                {/* Заголовок */}
                <h1 className="text-6xl font-bold text-white mb-4">{movie.title}</h1>

                {/* Рейтинг и жанры */}
                <div className="flex items-center gap-4 mb-6">
                    <CircleRating rating={movie.voteAverage} variant="compact" size="md" showNumber />
                    <span className="text-gray-500">|</span>
                    <span className="text-gray-300 text-sm">{movie.genres.join(', ')}</span>
                </div>

                {/* Кнопки действий */}
                <div className="flex items-center gap-3 mb-10">
                    <button
                        className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black px-5 py-2.5 rounded-xl font-semibold text-sm transition-all"
                    >
                        <Play size={16} fill="black" />
                        Watch Trailer
                    </button>

                    <button
                        onClick={handleToggleWatchlist}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all border ${
                            inWatchlist
                                ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400'
                                : 'bg-white/5 hover:bg-white/10 border-white/10 text-white'
                        }`}
                    >
                        {inWatchlist ? <Check size={16} /> : <Plus size={16} />}
                        {inWatchlist ? 'In Watchlist' : 'Watchlist'}
                    </button>

                    <button
                        onClick={handleLike}
                        aria-label={isLiked ? 'Unlike' : 'Like'}
                        className={`p-2.5 rounded-xl border transition-all ${
                            isLiked
                                ? 'bg-red-500/20 border-red-500/40 text-red-400'
                                : 'bg-white/5 hover:bg-white/10 border-white/10 text-white'
                        }`}
                    >
                        <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
                    </button>

                    <button
                        aria-label="Share"
                        className="bg-white/5 hover:bg-white/10 text-white p-2.5 rounded-xl border border-white/10 transition-all"
                    >
                        <Share2 size={16} />
                    </button>
                </div>

                {/* Два колоночный layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Левая колонка — основной контент */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Synopsis */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                            <h2 className="text-cyan-400 text-lg font-semibold mb-3">Synopsis</h2>
                            <p className="text-gray-300 leading-relaxed mb-6">
                                {movie.overview}
                            </p>

                            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-white/10">
                                {movie.directors.length > 0 && (
                                    <div>
                                        <p className="text-gray-500 text-xs mb-1">Director</p>
                                        <p className="text-white text-sm">{movie.directors.join(', ')}</p>
                                    </div>
                                )}
                                <div>
                                    <p className="text-gray-500 text-xs mb-1">Released</p>
                                    <p className="text-white text-sm">
                                        {new Date(movie.releaseDate).toLocaleDateString('en-US', {
                                            month: 'long', day: 'numeric', year: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Cast & Crew */}
                        {movie.cast.length > 0 && (
                            <div>
                                <h2 className="text-xl font-bold text-white mb-4">Cast & Crew</h2>
                                <HorizontalScroll>
                                    {movie.cast.map(member => (
                                        <div key={member.id} className="shrink-0 text-center w-24">
                                            {member.profilePath ? (
                                                <img
                                                    src={member.profilePath}
                                                    alt={member.name}
                                                    className="w-24 h-24 rounded-full object-cover mb-2"
                                                />
                                            ) : (
                                                <div className="w-24 h-24 rounded-full bg-white/5 mb-2" />
                                            )}
                                            <p className="text-white text-xs font-medium line-clamp-1">{member.name}</p>
                                            <p className="text-gray-500 text-xs line-clamp-1">{member.character}</p>
                                        </div>
                                    ))}
                                </HorizontalScroll>
                            </div>
                        )}
                        {/* Related Movies */}
                        {movie.similar.length > 0 && (
                            <div>
                                <h2 className="text-xl font-bold text-white mb-4">Related Movies</h2>
                                <HorizontalScroll>
                                    {movie.similar.map(m => (
                                        <MovieCard key={m.id} movie={m} size="sm" />
                                    ))}
                                </HorizontalScroll>
                            </div>
                        )}
                    </div>

                    {/* Правая колонка — рецензии */}
                    <div className="space-y-4">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold text-white">User Reviews</h2>
                                {isAuthenticated && !hasUserReview && (
                                    <button
                                        onClick={() => setShowReviewForm(!showReviewForm)}
                                        className="text-cyan-400 text-xs font-semibold tracking-wider hover:text-cyan-300"
                                    >
                                        {showReviewForm ? 'CANCEL' : 'WRITE'}
                                    </button>
                                )}
                            </div>

                            {/* Форма рецензии */}
                            {showReviewForm && (
                                <div className="mb-4">
                                    <ReviewForm onSubmit={handleCreateReview} />
                                </div>
                            )}

                            {!isAuthenticated && (
                                <p className="text-gray-500 text-sm mb-4">
                                    <Link to="/login" className="text-cyan-400 hover:text-cyan-300 underline">
                                        Sign in
                                    </Link>{' '}
                                    to write a review
                                </p>
                            )}

                            {/* Список рецензий */}
                            <div className="space-y-4">
                                {reviews.length === 0 ? (
                                    <p className="text-gray-500 text-sm">No reviews yet. Be the first!</p>
                                ) : (
                                    reviews.slice(0, 5).map(review => (
                                        <ReviewCard
                                            key={review.id}
                                            review={review}
                                            canDelete={review.userName === userName}
                                            onDelete={handleDeleteReview}
                                        />
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}