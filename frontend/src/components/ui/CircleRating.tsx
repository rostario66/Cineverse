import { useState } from 'react';

interface CircleRatingProps {
    rating: number;              // 0.5 - 10 с шагом 0.5
    variant?: 'compact' | 'full'; // 5 кружков / 10 кружков
    size?: 'sm' | 'md' | 'lg';
    interactive?: boolean;
    onChange?: (rating: number) => void;
    showNumber?: boolean;
}

export default function CircleRating({
    rating,
    variant = 'compact',
    size = 'md',
    interactive = false,
    onChange,
    showNumber = true,
}: CircleRatingProps) {
    const [hovered, setHovered] = useState<number | null>(null);
    const displayRating = hovered ?? rating;

    const sizes = {
        sm: 'w-3 h-3',
        md: 'w-4 h-4',
        lg: 'w-6 h-6',
    };

    // Сколько кружков и какой шаг для каждого
    const circleCount = variant === 'compact' ? 5 : 10;
    const pointsPerCircle = variant === 'compact' ? 2 : 1;
    const stepsPerCircle = variant === 'compact' ? 4 : 2;

    return (
        <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1">
                {Array.from({ length: circleCount }, (_, i) => {
                    const circleStartPoint = i * pointsPerCircle;
                    const circleEndPoint = (i + 1) * pointsPerCircle;

                    // Сколько баллов в этом кружке от displayRating
                    const pointsInThisCircle = Math.max(
                        0,
                        Math.min(pointsPerCircle, displayRating - circleStartPoint)
                    );

                    // Процент заполнения (25%, 50%, 75%, 100% для compact)
                    const fillPercent = (pointsInThisCircle / pointsPerCircle) * 100;

                    return (
                        <div
                            key={i}
                            className={`relative ${sizes[size]} ${interactive ? 'cursor-pointer' : ''}`}
                            onMouseLeave={() => interactive && setHovered(null)}
                        >
                            {/* Пустой кружок (контур) */}
                            <div className="absolute inset-0 rounded-full border-2 border-gray-600" />

                            {/* Заполнение */}
                            {fillPercent > 0 && (
                                <div
                                    className="absolute inset-0 rounded-full bg-cyan-400"
                                    style={{ clipPath: `inset(0 ${100 - fillPercent}% 0 0)` }}
                                />
                            )}

                            {/* Интерактивные зоны клика */}
                            {interactive && (
                                <div className="absolute inset-0 flex">
                                    {Array.from({ length: stepsPerCircle }, (_, stepIndex) => {
                                        const stepValue =
                                            circleStartPoint + ((stepIndex + 1) / stepsPerCircle) * pointsPerCircle;
                                        return (
                                            <div
                                                key={stepIndex}
                                                className="flex-1 h-full"
                                                onMouseEnter={() => setHovered(stepValue)}
                                                onClick={() => onChange?.(stepValue)}
                                            />
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {showNumber && (
                <span className="text-gray-300 text-sm font-medium tabular-nums">
                    {displayRating.toFixed(1)}
                </span>
            )}
        </div>
    );
}