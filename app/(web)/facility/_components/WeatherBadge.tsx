"use client";

import { Icon } from "@/components/ui/Icon";

export interface CurrentWeather {
  temperature: number;
  weathercode: number;
  time?: string;
  is_day?: number;
}

const WEATHER_MESSAGES: Record<string, { icon: string; label: string }> = {
  clear: { icon: "light_mode", label: "Sunčano" },
  cloudy: { icon: "cloud", label: "Oblačno" },
  rainy: { icon: "rainy", label: "Kiša" },
};

function getWeatherDescriptor(code: number): { icon: string; label: string } {
  if (code === 0) return WEATHER_MESSAGES.clear;
  if (code < 4) return WEATHER_MESSAGES.cloudy;
  return WEATHER_MESSAGES.rainy;
}

export function WeatherBadge({ weather }: { weather: CurrentWeather | null }) {
  if (!weather) return null;

  const desc = getWeatherDescriptor(weather.weathercode);

  return (
    <div className="glass-frost flex items-center gap-3 rounded-full border-white/25 px-4 py-2 shadow-xl">
      <Icon name={desc.icon} className="text-primary text-[20px]" />
      <span className="text-foreground text-sm font-black whitespace-nowrap">
        {Math.round(weather.temperature)}°C
      </span>
      <div className="bg-border hidden h-4 w-px md:block" />
      <span className="text-muted-foreground hidden text-xs font-bold tracking-widest uppercase md:inline">
        {desc.label}
      </span>
    </div>
  );
}
