"use client";

import type { Session, User } from "@supabase/supabase-js";
import { create } from "zustand";

import { getAuthSession } from "../apis/auth";

interface AuthState {
  isLoading: boolean;
  session: Session | null;
  user: User | null;
  clearSession: () => void;
  hydrateSession: () => Promise<Session | null>;
  refreshSession: () => Promise<Session | null>;
  setSession: (session: Session | null) => void;
}

function getUserFromSession(session: Session | null) {
  return session?.user ?? null;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoading: true,
  session: null,
  user: null,
  clearSession: () =>
    set({
      isLoading: false,
      session: null,
      user: null,
    }),
  hydrateSession: async () => {
    set({ isLoading: true });

    const { data, error } = await getAuthSession();

    if (error) {
      set({
        isLoading: false,
        session: null,
        user: null,
      });
      throw error;
    }

    const session = data.session ?? null;

    set({
      isLoading: false,
      session,
      user: getUserFromSession(session),
    });

    return session;
  },
  refreshSession: async () => {
    const { data, error } = await getAuthSession();

    if (error) {
      set({
        session: null,
        user: null,
      });
      throw error;
    }

    const session = data.session ?? null;

    set({
      session,
      user: getUserFromSession(session),
    });

    return session;
  },
  setSession: (session) =>
    set({
      isLoading: false,
      session,
      user: getUserFromSession(session),
    }),
}));
