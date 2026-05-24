"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";

export function ZustandProvider({ children }: { children: React.ReactNode }) {
  const checkSession = useAuthStore((state) => state.checkSession);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  return <>{children}</>;
}
