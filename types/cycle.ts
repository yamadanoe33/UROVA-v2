export type SymptomId =
  | "cramps"
  | "headache"
  | "bloating"
  | "mood"
  | "fatigue"
  | "acne";

export type CycleSettings = {
  lastPeriodDate: string; // YYYY-MM-DD
  cycleLength: number;
  periodLength: number;
};

export type SymptomLog = {
  date: string; // YYYY-MM-DD
  symptoms: SymptomId[];
};

export type CycleStore = {
  settings: CycleSettings;
  symptoms: SymptomLog[];
};

export type CycleSummary = {
  cycleDay: number;
  daysUntilNextPeriod: number;
  nextPeriodDate: Date;
  fertileStart: Date;
  fertileEnd: Date;
  ovulationDate: Date;
  isPeriodWindow: boolean;
  isFertileWindow: boolean;
};
