"use client";

import { useEffect, useState } from "react";

export type TimeOfDay = "morning" | "day" | "evening" | "night";

export interface LightingPreset {
  period: TimeOfDay;
  sky: string;
  background: string;
  fog: string;
  ambientIntensity: number;
  hemisphereSky: string;
  hemisphereGround: string;
  hemisphereIntensity: number;
  directionalColor: string;
  directionalIntensity: number;
  windowIntensity: number;
  roomTint: string;
}

export const lightingPresets: Record<TimeOfDay, LightingPreset> = {
  morning: {
    period: "morning", sky: "#f5cfaa", background: "#d9d1c5", fog: "#d9d1c5",
    ambientIntensity: .95, hemisphereSky: "#ffe4c2", hemisphereGround: "#8f887d",
    hemisphereIntensity: .8, directionalColor: "#ffd6a1", directionalIntensity: 1.25,
    windowIntensity: 1.05, roomTint: "#e9e3d8",
  },
  day: {
    period: "day", sky: "#dcecff", background: "#d8d5cc", fog: "#d8d5cc",
    ambientIntensity: 1.35, hemisphereSky: "#fffdf6", hemisphereGround: "#918d84",
    hemisphereIntensity: 1.1, directionalColor: "#fffdf5", directionalIntensity: 1.8,
    windowIntensity: 1.35, roomTint: "#e8e5dc",
  },
  evening: {
    period: "evening", sky: "#c97962", background: "#b8aaa0", fog: "#b8aaa0",
    ambientIntensity: .68, hemisphereSky: "#e8a37f", hemisphereGround: "#6f6864",
    hemisphereIntensity: .58, directionalColor: "#ef9b72", directionalIntensity: .9,
    windowIntensity: .82, roomTint: "#dfd8d0",
  },
  night: {
    period: "night", sky: "#1d2b45", background: "#777a80", fog: "#777a80",
    ambientIntensity: .38, hemisphereSky: "#62718c", hemisphereGround: "#403f43",
    hemisphereIntensity: .32, directionalColor: "#9ba9c2", directionalIntensity: .38,
    windowIntensity: .32, roomTint: "#cbc9c6",
  },
};

export function getTimeOfDay(hour: number): TimeOfDay {
  if (hour >= 6 && hour < 11) return "morning";
  if (hour >= 11 && hour < 17) return "day";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
}

export function useTimeOfDay(override?: TimeOfDay): LightingPreset {
  const [period, setPeriod] = useState<TimeOfDay>("day");

  useEffect(() => {
    const update = () => setPeriod(getTimeOfDay(new Date().getHours()));
    update();
    const interval = window.setInterval(update, 60_000);
    return () => window.clearInterval(interval);
  }, []);

  return lightingPresets[override ?? period];
}
