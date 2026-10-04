"use client";

import { useEffect, useMemo, useState } from "react";
import type { CycleSettings, CycleStore, SymptomId } from "@/types/cycle";
import { calculateCycleSummary, toDateInputValue } from "@/lib/cycle";

const STORAGE_KEY = "urova-cycle-tracker-v1";

function defaultSettings(): CycleSettings {
  const fallback = new Date();
  fallback.setDate(fallback.getDate() - 23);

  return {
    lastPeriodDate: toDateInputValue(fallback),
    cycleLength: 28,
    periodLength: 5,
  };
}

function makeDefaultStore(): CycleStore {
  return {
    settings: defaultSettings(),
    symptoms: [],
  };
}

export function useCycleData() {
  const [store, setStore] = useState<CycleStore>(() => makeDefaultStore());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as CycleStore;
        setStore(parsed);
      }
    } catch {
      // Ignore broken local data and fall back to defaults.
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  }, [store, ready]);

  const summary = useMemo(
    () => calculateCycleSummary(store.settings),
    [store.settings]
  );

  function updateSettings(next: CycleSettings) {
    setStore((current) => ({ ...current, settings: next }));
  }

  function toggleSymptom(symptom: SymptomId) {
    const today = toDateInputValue(new Date());

    setStore((current) => {
      const found = current.symptoms.find((entry) => entry.date === today);

      if (!found) {
        return {
          ...current,
          symptoms: [...current.symptoms, { date: today, symptoms: [symptom] }],
        };
      }

      const exists = found.symptoms.includes(symptom);
      const nextSymptoms = exists
        ? found.symptoms.filter((item) => item !== symptom)
        : [...found.symptoms, symptom];

      return {
        ...current,
        symptoms: current.symptoms.map((entry) =>
          entry.date === today ? { ...entry, symptoms: nextSymptoms } : entry
        ),
      };
    });
  }

  const todaySymptoms = useMemo(() => {
    const today = toDateInputValue(new Date());
    return store.symptoms.find((entry) => entry.date === today)?.symptoms ?? [];
  }, [store.symptoms]);

  return {
    ready,
    settings: store.settings,
    summary,
    todaySymptoms,
    updateSettings,
    toggleSymptom,
  };
}
