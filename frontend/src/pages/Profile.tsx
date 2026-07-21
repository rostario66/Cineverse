import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useMyProfile } from '../hooks/useProfile';
import { useMyWatchlist } from '../hooks/useWatchlist';
import { useMyReviews } from '../hooks/useReviews';
import { useMyLikes } from '../hooks/useLikes';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileTabs, { type TabId } from '../components/profile/ProfileTabs';
import MovieGridFromIds from '../components/profile/MovieGridFromIds';
import ReviewCard from '../components/movie/ReviewCard';

export default function ProfilePage() {
    const { isAuthenticated } = useAuth();
    const [activeTab, setActiveTab] = useState<TabId>('watchlist');

    // Все данные через кастомные хуки
    const { profile, isLoading: profileLoading } = useMyProfile();
    const { watchlistIds, watchedIds } = useMyWatchlist();
    const { reviews } = useMyReviews();
    const { likedIds } = useMyLikes();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (profileLoading || !profile) {
        return (
            <div className="px-10 py-8">
                <div className="h-40 bg-white/5 rounded-2xl animate-pulse" />
            </div>
        );
    }

    return (
        <div className="px-10 py-8">
            <ProfileHeader profile={profile} isCurrentUser={true} />
            <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

            {activeTab === 'watchlist' && (
                <MovieGridFromIds
                    tmdbIds={watchlistIds}
                    emptyMessage="Your watchlist is empty"
                />
            )}

            {activeTab === 'watched' && (
                <MovieGridFromIds
                    tmdbIds={watchedIds}
                    emptyMessage="No watched movies yet"
                />
            )}

            {activeTab === 'reviews' && (
                <div className="space-y-4 max-w-3xl">
                    {reviews.length === 0 ? (
                        <p className="text-gray-500 text-sm py-8 text-center">
                            No reviews yet
                        </p>
                    ) : (
                        reviews.map(review => (
                            <ReviewCard key={review.id} review={review} />
                        ))
                    )}
                </div>
            )}

            {activeTab === 'liked' && (
                <MovieGridFromIds
                    tmdbIds={likedIds}
                    emptyMessage="No liked movies yet"
                />
            )}
        </div>
    );
}