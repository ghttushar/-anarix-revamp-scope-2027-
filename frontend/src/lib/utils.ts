import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// The type scale adds text-2xs and text-caption (tailwind.config.ts). Register them as font sizes, or
// tailwind-merge reads them as text colours and drops them next to e.g. text-muted-foreground.
const twMerge = extendTailwindMerge({
  extend: { classGroups: { "font-size": [{ text: ["2xs", "caption"] }] } },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
