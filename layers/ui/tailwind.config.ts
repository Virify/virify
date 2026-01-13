import type { Config } from "tailwindcss";

export default <Config>{
  theme: {
    extend: {
      colors: {
        // Backgrounds and foregrounds
        foreground: {
          100: "var(--foreground-100)",
          200: "var(--foreground-200)",
          300: "var(--foreground-300)",
        },
        background: {
          100: "var(--background-100)",
          200: "var(--background-200)",
          300: "var(--background-300)",
        },

        // Monochrome
        monochrome: {
          100: "var(--monochrome-100)",
          200: "var(--monochrome-200)",
          300: "var(--monochrome-300)",
          400: "var(--monochrome-400)",
          500: "var(--monochrome-500)",
          600: "var(--monochrome-600)",
          700: "var(--monochrome-700)",
          800: "var(--monochrome-800)",
          900: "var(--monochrome-900)",
        },

        // Primary (Purple/Blue in logic, named Blue in CSS vars)
        // Aliased as both 'brand-purple' and 'blue' to match potential usages
        "brand-purple": {
          DEFAULT: "var(--blue-400)",
          0: "var(--blue-0)",
          50: "var(--blue-50)",
          100: "var(--blue-100)",
          200: "var(--blue-200)",
          300: "var(--blue-300)",
          400: "var(--blue-400)",
          500: "var(--blue-500)",
          600: "var(--blue-600)",
          700: "var(--blue-700)",
          800: "var(--blue-800)",
          900: "var(--blue-900)",
        },
        // Keeping the original name 'blue' as well
        blue: {
          DEFAULT: "var(--blue-500)",
          0: "var(--blue-0)",
          50: "var(--blue-50)",
          100: "var(--blue-100)",
          200: "var(--blue-200)",
          300: "var(--blue-300)",
          400: "var(--blue-400)",
          500: "var(--blue-500)",
          600: "var(--blue-600)",
          700: "var(--blue-700)",
          800: "var(--blue-800)",
          900: "var(--blue-900)",
        },

        // Green (Named Primary in CSS vars)
        // Aliased as 'brand-green'
        "brand-green": {
          DEFAULT: "var(--primary-500)",
          0: "var(--primary-0)",
          50: "var(--primary-50)",
          100: "var(--primary-100)",
          200: "var(--primary-200)",
          300: "var(--primary-300)",
          400: "var(--primary-400)",
          500: "var(--primary-500)",
          600: "var(--primary-600)",
          700: "var(--primary-700)",
          800: "var(--primary-800)",
          900: "var(--primary-900)",
        },

        // Orange (Named Secondary in CSS vars)
        // Aliased as 'brand-orange' and 'brand-accent'
        "brand-orange": {
          DEFAULT: "var(--secondary-500)",
          0: "var(--secondary-0)",
          50: "var(--secondary-50)",
          100: "var(--secondary-100)",
          200: "var(--secondary-200)",
          300: "var(--secondary-300)",
          400: "var(--secondary-400)",
          500: "var(--secondary-500)",
          600: "var(--secondary-600)",
          700: "var(--secondary-700)",
          800: "var(--secondary-800)",
          900: "var(--secondary-900)",
        },
        "brand-accent": {
          DEFAULT: "var(--secondary-500)",
          0: "var(--secondary-0)",
          50: "var(--secondary-50)",
          100: "var(--secondary-100)",
          200: "var(--secondary-200)",
          300: "var(--secondary-300)",
          400: "var(--secondary-400)",
          500: "var(--secondary-500)",
          600: "var(--secondary-600)",
          700: "var(--secondary-700)",
          800: "var(--secondary-800)",
          900: "var(--secondary-900)",
        },

        // Brand Background
        "brand-bg": {
          100: "var(--background-100)",
          200: "var(--background-200)",
          300: "var(--background-300)",
        },

        // Tertiary (Blue/Cyan in values, named Tertiary in CSS vars)
        tertiary: {
          DEFAULT: "var(--tertiary-500)",
          0: "var(--tertiary-0)",
          50: "var(--tertiary-50)",
          100: "var(--tertiary-100)",
          200: "var(--tertiary-200)",
          300: "var(--tertiary-300)",
          400: "var(--tertiary-400)",
          500: "var(--tertiary-500)",
          600: "var(--tertiary-600)",
          700: "var(--tertiary-700)",
          800: "var(--tertiary-800)",
          900: "var(--tertiary-900)",
        },

        // States
        error: {
          DEFAULT: "var(--error)",
          background: "var(--error-background)",
          foreground: "var(--error-foreground)",
        },
        success: {
          DEFAULT: "var(--success)",
          background: "var(--success-background)",
          foreground: "var(--success-foreground)",
        },
        favourite: "var(--favourite-colour)",
      },
    },
  },
};
