import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

import newFullLight from "@/assets/branding/anarix-full-light.svg";
import newFullDark from "@/assets/branding/anarix-full-dark.svg";
import newSymbol from "@/assets/branding/anarix-symbol.svg";

interface AnarixLogoProps {
  variant?: "full" | "symbol";
  className?: string;
  alt?: string;
}

export function AnarixLogo({ variant = "full", className, alt = "Anarix" }: AnarixLogoProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const src = variant === "symbol" ? newSymbol : (isDark ? newFullDark : newFullLight);

  return <img src={src} alt={alt} className={cn("object-contain", className)} />;
}
