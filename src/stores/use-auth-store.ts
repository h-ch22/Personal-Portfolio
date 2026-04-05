import type { User } from "firebase/auth";
import { create } from "zustand";

interface AuthState {
    user: User | null;
    userName: string | null;
    isAdmin: boolean;
}

export const useAuthStore = create<AuthState>(() => ({
    user: null,
    userName: null,
    isAdmin: false
}))
