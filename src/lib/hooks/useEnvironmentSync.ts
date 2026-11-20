import { useEffect, useState } from "react";

export type WeatherState = "clear" | "rain" | "clouds" | "snow" | "thunderstorm" | "unknown";
export type TimeOfDay = "day" | "night" | "sunset" | "sunrise";

export interface EnvironmentState {
  weather: WeatherState;
  timeOfDay: TimeOfDay;
  loading: boolean;
  error: string | null;
}

const getInitialEnvironmentState = (): EnvironmentState => ({
  weather: "unknown",
  timeOfDay: getTimeOfDay(new Date().getHours()),
  loading: false,
  error: null
});

const getTimeOfDay = (currentHour: number): TimeOfDay => {
  if (currentHour >= 6 && currentHour < 9) return "sunrise";
  if (currentHour >= 9 && currentHour < 17) return "day";
  if (currentHour >= 17 && currentHour < 20) return "sunset";
  return "night";
};

export function useEnvironmentSync(): EnvironmentState {
  const [env, setEnv] = useState<EnvironmentState>(getInitialEnvironmentState);

  useEffect(() => {
    const updateTimeOfDay = () => {
      setEnv({
        weather: "unknown",
        timeOfDay: getTimeOfDay(new Date().getHours()),
        loading: false,
        error: null
      });
    };

    updateTimeOfDay();

    const intervalId = window.setInterval(updateTimeOfDay, 15 * 60 * 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  return env;
}
