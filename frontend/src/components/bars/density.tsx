import { createContext, useContext, type ReactNode } from "react";

/**
 * How big a bar's controls are. Page bars and toolbars use the default (h-8); the chart bar is compact (h-7, smaller
 * text) so it stays quiet next to the chart.
 */
export type Density = "default" | "compact";

const DensityContext = createContext<Density>("default");

export function BarDensity({ value, children }: { value: Density; children: ReactNode }) {
  return <DensityContext.Provider value={value}>{children}</DensityContext.Provider>;
}

export const useBarDensity = () => useContext(DensityContext);
