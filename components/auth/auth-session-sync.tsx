"use client";

import { useEffect } from "react";

import { subscribeToAuthState } from "../../apis/auth";
import { useAuthStore } from "../../stores/auth-store";

export default function AuthSessionSync() {
  const clearSession = useAuthStore((state) => state.clearSession);
  const hydrateSession = useAuthStore((state) => state.hydrateSession);
  const setSession = useAuthStore((state) => state.setSession);

  useEffect(() => {
    void hydrateSession().catch(() => {
      clearSession();
    });

    const subscription = subscribeToAuthState((session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [clearSession, hydrateSession, setSession]);

  return null;
}
