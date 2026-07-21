export interface Movie {
    id: number;
    title: string;
    overview: string;
    posterPath: string;
    backdropPath: string;
    releaseDate: string;
    voteAverage: number;
    runtime: number,
    genres: string[];
    directors: string[];
    cast: CastMember[];
    similar: Movie[];
}

export interface CastMember {
    id: number;
    name: string;
    character: string;
    profilePath: string;
}

export interface MovieSearchResult {
    movies: Movie[];
    totalResults: number;
    totalPages: number;
    currentPage: number;
}

export interface Review {
    id: string;
    userId: string;
    userName: string;
    tmdbMovieId: number;
    rating: number;
    content: string;
    createdAt: string;
}

export interface WatchlistItem {
    id: string;
    tmdbMovieId: number;
    isWatched: boolean;
    addedAt: string;
}

export interface UserProfile {
    id: string;
    userName: string;
    email: string;
    createdAt: string;
    reviewsCount: number;
    watchlistCount: number;
    watchedCount: number
    followersCount: number;
    followingCount: number;
}

export interface AuthResponse {
    token: string;
    userName: string;
    email: string;
}

export interface Genre {
    id: number;
    name: string;
}