import { useState } from 'react';
import CircleRating from '../ui/CircleRating';

interface ReviewFormProps {
    onSubmit: (data: { rating: number; content: string }) => Promise<void>;
}

type Mode = 'rate' | 'review';

export default function ReviewForm({ onSubmit }: ReviewFormProps) {
    const [mode, setMode] = useState<Mode>('rate');
    const [rating, setRating] = useState(0);
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        setError(null);

        if (rating === 0) {
            setError('Please rate the movie');
            return;
        }
        if (mode === 'review' && content.trim().length < 10) {
            setError('Review must be at least 10 characters');
            return;
        }

        setIsSubmitting(true);
        try {
            await onSubmit({
                rating,
                content: mode === 'review' ? content : '',
            });
            setRating(0);
            setContent('');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to submit');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
            {/* Переключатель режима */}
            <div className="flex gap-2 p-1 bg-white/5 rounded-xl">
                <button
                    type="button"
                    onClick={() => setMode('rate')}
                    className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        mode === 'rate'
                            ? 'bg-cyan-500 text-black'
                            : 'text-gray-400 hover:text-white'
                    }`}
                >
                    Just rate
                </button>
                <button
                    type="button"
                    onClick={() => setMode('review')}
                    className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        mode === 'review'
                            ? 'bg-cyan-500 text-black'
                            : 'text-gray-400 hover:text-white'
                    }`}
                >
                    Rate & review
                </button>
            </div>

            {/* Рейтинг */}
            <div>
                <label className="block text-sm text-gray-300 mb-2">Your rating</label>
                <CircleRating
                    rating={rating}
                    variant="full"
                    size="lg"
                    interactive
                    onChange={setRating}
                    showNumber
                />
            </div>

            {/* Текст — только в режиме review */}
            {mode === 'review' && (
                <div>
                    <label className="block text-sm text-gray-300 mb-2">Your thoughts</label>
                    <textarea
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        rows={5}
                        placeholder="Share what you think about this movie..."
                        className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl outline-none focus:border-cyan-500/50 transition-colors resize-none"
                    />
                </div>
            )}

            {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl">
                    {error}
                </div>
            )}

            <button
                type="submit"
                disabled={isSubmitting}
                className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-black font-semibold px-6 py-2.5 rounded-xl transition-colors"
            >
                {isSubmitting ? 'Submitting...' : mode === 'rate' ? 'Submit Rating' : 'Post Review'}
            </button>
        </form>
    );
}