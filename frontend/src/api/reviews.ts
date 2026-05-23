import api from "./client";
import type { Review } from "../types";

export const reviewsApi = {
    getByMovie: (tmdbMovieId: number) => 
        api.get<Review[]>(`/reviews/movie/${tmdbMovieId}`),

    getMy: () => 
        api.get<Review[]>(`/reviews/my`),

    create: (data: { tmdbMovieId: number; rating: number; content: string }) =>
        api.post<Review>("/reviews", data),

    delete: (reviewId: string) => 
        api.delete(`/reviews/${reviewId}`)
};