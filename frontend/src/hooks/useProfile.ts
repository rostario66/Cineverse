import { usersApi } from "../api/users";
import { useFetch } from "./useFetch";
import type { UserProfile } from "../types";

export function useMyProfile() {
    const { data: profile, isLoading, error } = useFetch<UserProfile>(
        () => usersApi.getMe(),
        []
    );

    return { profile, isLoading, error };
}

export function useUserProfile(userId: string) {
    const { data: profile, isLoading, error } = useFetch<UserProfile>(
        () => usersApi.getProfile(userId),
        [userId]
    );

    return { profile, isLoading, error };
}