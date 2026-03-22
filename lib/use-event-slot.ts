"use client";

import { useSyncExternalStore } from "react";
import { DEFAULT_EVENT_SLOT, EVENT_STORAGE_KEY } from "@/lib/demo-data";
import type { TimeSlot } from "@/lib/scheduling";

const EVENT_NAME = "meetflow:eventSlot";

function subscribe(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(EVENT_NAME, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(EVENT_NAME, onStoreChange);
  };
}

function getSnapshot(): TimeSlot {
  try {
    const raw = localStorage.getItem(EVENT_STORAGE_KEY);
    if (raw && /^\d+-\d+$/.test(raw)) return raw;
  } catch {
    /* ignore */
  }
  return DEFAULT_EVENT_SLOT;
}

function getServerSnapshot(): TimeSlot {
  return DEFAULT_EVENT_SLOT;
}

/** Reads persisted meeting slot; updates when storage changes or `notifyEventSlotChange` runs. */
export function useEventSlotFromStorage(): TimeSlot {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function notifyEventSlotChange(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(EVENT_NAME));
}
