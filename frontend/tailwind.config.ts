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
        // Text tones (with foreground = strong, muted-foreground = muted)
        body: "hsl(var(--text-body))",
        faint: "hsl(var(--text-faint))",
        line2: "hsl(var(--line-2))",
        tint: { DEFAULT: "hsl(var(--tint))", line: "hsl(var(--tint-line))" },
        /* palette:start */
        peri: { "25": "hsl(var(--peri-25))", "50": "hsl(var(--peri-50))", "100": "hsl(var(--peri-100))", "150": "hsl(var(--peri-150))", "200": "hsl(var(--peri-200))", "300": "hsl(var(--peri-300))", "400": "hsl(var(--peri-400))", "500": "hsl(var(--peri-500))", "600": "hsl(var(--peri-600))", "700": "hsl(var(--peri-700))", "800": "hsl(var(--peri-800))", "900": "hsl(var(--peri-900))" },
        haze: { "25": "hsl(var(--haze-25))", "50": "hsl(var(--haze-50))", "75": "hsl(var(--haze-75))", "100": "hsl(var(--haze-100))", "125": "hsl(var(--haze-125))", "150": "hsl(var(--haze-150))", "175": "hsl(var(--haze-175))", "200": "hsl(var(--haze-200))", "225": "hsl(var(--haze-225))", "250": "hsl(var(--haze-250))", "300": "hsl(var(--haze-300))", "350": "hsl(var(--haze-350))", "400": "hsl(var(--haze-400))", "450": "hsl(var(--haze-450))", "500": "hsl(var(--haze-500))", "550": "hsl(var(--haze-550))", "600": "hsl(var(--haze-600))", "650": "hsl(var(--haze-650))", "700": "hsl(var(--haze-700))", "750": "hsl(var(--haze-750))", "800": "hsl(var(--haze-800))", "850": "hsl(var(--haze-850))", "900": "hsl(var(--haze-900))" },
        grey: { "0": "hsl(var(--grey-0))", "50": "hsl(var(--grey-50))", "100": "hsl(var(--grey-100))", "150": "hsl(var(--grey-150))", "200": "hsl(var(--grey-200))", "250": "hsl(var(--grey-250))", "300": "hsl(var(--grey-300))", "350": "hsl(var(--grey-350))", "400": "hsl(var(--grey-400))", "450": "hsl(var(--grey-450))", "500": "hsl(var(--grey-500))", "600": "hsl(var(--grey-600))", "700": "hsl(var(--grey-700))", "800": "hsl(var(--grey-800))", "900": "hsl(var(--grey-900))", "1000": "hsl(var(--grey-1000))" },
        info: { "400": "hsl(var(--info-400))", "500": "hsl(var(--info-500))", "600": "hsl(var(--info-600))", "700": "hsl(var(--info-700))" },
        danger: { "50": "hsl(var(--danger-50))", "300": "hsl(var(--danger-300))", "400": "hsl(var(--danger-400))", "500": "hsl(var(--danger-500))", "600": "hsl(var(--danger-600))" },
        positive: { "50": "hsl(var(--positive-50))", "100": "hsl(var(--positive-100))", "150": "hsl(var(--positive-150))", "500": "hsl(var(--positive-500))", "600": "hsl(var(--positive-600))" },
        caution: { "50": "hsl(var(--caution-50))", "300": "hsl(var(--caution-300))", "400": "hsl(var(--caution-400))", "500": "hsl(var(--caution-500))", "600": "hsl(var(--caution-600))" },
        /* palette:end */
        hover: "hsl(var(--hover))",
        selected: "hsl(var(--selected))",
        // Chips: fill / outline opacity come from --control-alpha / --control-border-alpha (0 inside a kit sheet = ghost).
        control: { DEFAULT: "hsl(var(--control) / var(--control-alpha))", border: "hsl(var(--control-border) / var(--control-border-alpha))" },
        field: "hsl(var(--field))",
        track: "hsl(var(--track))",
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
      boxShadow: {
        e1: "var(--k-shadow-e1)",
        card: "var(--k-shadow-card)",
        e2: "var(--k-shadow-e2)",
        e3: "var(--k-shadow-e3)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "k-fade-up": { from: { opacity: "0", transform: "translateY(6px)" }, to: { opacity: "1", transform: "none" } },
        "k-row-in": { from: { opacity: "0", transform: "translateY(3px)" }, to: { opacity: "1", transform: "none" } },
        "k-pop-in": { from: { opacity: "0", transform: "scale(.96) translateY(-4px)" }, to: { opacity: "1", transform: "none" } },
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
