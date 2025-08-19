"use client";

import { useEffect } from "react";
import { ensureAnonAuth, subscribeAuth } from "./initFirebaseClient";
import { useAppDispatch } from "@/store/hooks";
import { setUser } from "@/store/slices/authSlice";

export default function AuthGate() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    ensureAnonAuth();
    const unsub = subscribeAuth((u) => {
      dispatch(u ? setUser({ uid: u.uid, displayName: u.displayName ?? undefined }) : setUser(null));
    });
    return () => unsub();
  }, [dispatch]);

  return null;
}
