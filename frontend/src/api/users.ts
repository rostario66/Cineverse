import api from "./client";
import type { UserProfile } from "../types";

export const usersApi = {
    getMe: () =>
        api.get<UserProfile>("/users/me"),

    getProfile: (userId: string) =>
        api.get<UserProfile>(`/users/${userId}`),

    follow: (userId: string) => 
        api.post(`/users/${userId}/follow`),

    unfollow: (userId: string) => 
        api.delete(`/users/${userId}/follow`),

    getFollowers: (userId: string) => 
        api.get<UserProfile[]>(`/users/${userId}/followers`),

    getFollowing: (userId: string) => 
        api.get<UserProfile[]>(`/users/${userId}/following`)
}
