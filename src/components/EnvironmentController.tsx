"use client";

import { useEffect } from "react";
import { useEnvironmentSync } from "@/lib/hooks/useEnvironmentSync";

export function EnvironmentController() {
  const { weather, timeOfDay, loading } = useEnvironmentSync();

  useEffect(() => {
    if (loading) return;

    const root = document.documentElement;

    // Apply data attributes so global CSS can target them
    root.setAttribute("data-weather", weather);
    root.setAttribute("data-time", timeOfDay);

    // We can also set CSS variables dynamically here
    // Example: slightly cool tint for rain, warm for sunset
    if (weather === "rain" || weather === "snow") {
      root.style.setProperty("--env-tint", "rgba(100, 150, 255, 0.05)");
    } else if (timeOfDay === "sunset" || timeOfDay === "sunrise") {
      root.style.setProperty("--env-tint", "rgba(255, 150, 100, 0.05)");
    } else {
      root.style.setProperty("--env-tint", "rgba(0, 0, 0, 0)");
    }

  }, [weather, timeOfDay, loading]);

  // This component doesn't render any DOM elements
  return null;
}
