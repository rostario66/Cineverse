import api from './client';

export const likesApi = {
    getMy: () =>
        api.get<{ id: string; tmdbMovieId: number; createdAt: string }[]>('/likes'),

    checkStatus: (tmdbMovieId: number) =>
        api.get<{ isLiked: boolean }>(`/likes/${tmdbMovieId}/status`),

    like: (tmdbMovieId: number) =>
        api.post(`/likes/${tmdbMovieId}`),

    unlike: (tmdbMovieId: number) =>
        api.delete(`/likes/${tmdbMovieId}`),
};