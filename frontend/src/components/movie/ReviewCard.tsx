import { Trash2 } from 'lucide-react';
import type { Review } from '../../types';
import CircleRating from '../ui/CircleRating';

interface ReviewCardProps {
    review: Review;
    canDelete?: boolean;
    onDelete?: (reviewId: string) => void;
}

export default function ReviewCard({ review, canDelete, onDelete }: ReviewCardProps) {
    const date = new Date(review.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <div className="flex items-start justify-between mb-3">
                <div>
                    <p className="text-white font-medium">{review.userName}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{date}</p>
                </div>

                {canDelete && (
                    <button
                        onClick={() => onDelete?.(review.id)}
                        aria-label="Delete review"
                        className="text-gray-500 hover:text-red-400 transition-colors"
                    >
                        <Trash2 size={16} />
                    </button>
                )}
            </div>

            <div className={review.content ? 'mb-3' : ''}>
                <CircleRating rating={review.rating} variant="compact" size="sm" showNumber />
            </div>

            {/* Показываем текст только если он есть */}
            {review.content && (
                <p className="text-gray-300 text-sm leading-relaxed">{review.content}</p>
            )}
        </div>
    );
}