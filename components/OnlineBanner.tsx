"use client";

import { useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}

function getSnapshot() {
  return navigator.onLine;
}

function getServerSnapshot() {
  return true;
}

export function OnlineBanner() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (isOnline) return null;

  return (
    <div className="fixed left-0 right-0 top-0 z-[60] bg-amber-600 px-4 py-2 text-center text-sm font-medium text-white shadow-lg">
      ⚠️ Você está offline. Alguns recursos podem estar indisponíveis.
    </div>
  );
}
