import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        heading: ["var(--font-heading)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      /* Type scale = the old design's (new-page-old-design / anarix-ui: rem against an 11px root), so new screens
         and the ported ones read the same. Expressed against this app's 18px root, so only type changes, not spacing:
         2xs 11 (1rem) · caption 12.1 (1.1rem) · xs 13.2 (1.2rem, body/tables) · sm 14.3 (1.3rem) · base 15.4 (1.4rem)
         · lg/xl 17.6 (1.6rem, section headings) · 2xl 22 (2rem, page titles) · 3xl 26.4 (2.4rem, big KPI values).
         11px is the floor; no text-[Npx]. */
      fontSize: {
        "2xs": ["0.6111rem", { lineHeight: "0.8889rem" }],
        caption: ["0.6722rem", { lineHeight: "0.9444rem" }],
        xs: ["0.7333rem", { lineHeight: "1.0556rem" }],
        sm: ["0.7944rem", { lineHeight: "1.1111rem" }],
        base: ["0.8556rem", { lineHeight: "1.2222rem" }],
        lg: ["0.9778rem", { lineHeight: "1.3333rem" }],
        xl: ["0.9778rem", { lineHeight: "1.3333rem" }],
        "2xl": ["1.2222rem", { lineHeight: "1.5556rem" }],
        "3xl": ["1.4667rem", { lineHeight: "1.7778rem" }],
        "4xl": ["1.8333rem", { lineHeight: "2.2222rem" }],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        surface: "hsl(var(--surface))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
