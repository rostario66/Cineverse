import { useState, useEffect } from "react";
import { reviewsApi } from "../api/reviews";
import type { Review } from "../types";
import { useFetch } from "./useFetch";

export function useMovieReviews(tmdbMovieId: number) {
    const { data, isLoading, setData } = useFetch<Review[]>(
        () => reviewsApi.getByMovie(tmdbMovieId),
        [tmdbMovieId]
    );

    const reviews = data ?? [];
    
    const addReview = (review: Review) => {
        setData(prev => prev ? [review, ...prev] : [review]);
    };

    const removeReview = (reviewId: string) => {
        setData(prev => prev?.filter(r => r.id !== reviewId) ?? null);
    };

    return { reviews, isLoading, addReview, removeReview };
}

export function useMyReviews() {
    const { data, isLoading } = useFetch<Review[]>(
        () => reviewsApi.getMy(),
        []
    );

    return { reviews: data ?? [], isLoading }
}