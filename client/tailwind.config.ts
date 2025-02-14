import type { Config } from 'tailwindcss';

export default {
    darkMode: ['class'],
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}'
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    '50': '#ffffff',
                    '100': '#E4E4E7',
                    '200': '#c4c5cd',
                    '300': '#a6a8b4',
                    '400': '#898c9a',
                    '500': '#6c6f81',
                    '600': '#585D69',
                    '700': '#30354f',
                    '800': '#131836',
                    '900': '#000000',
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))'
                },
                accent: {
                    '100': '#FFEFEA',
                    '200': '#FFD3C6',
                    '300': '#FFB7A2',
                    '400': '#FFA57D',
                    '500': '#FF8D58',
                    '600': '#FF7633',
                    '700': '#FF5F20',
                    '800': '#FF471E',
                    '900': '#E27447 ',
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))'
                },
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))'
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))'
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))'
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))'
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))'
                },
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                chart: {
                    '1': 'hsl(var(--chart-1))',
                    '2': 'hsl(var(--chart-2))',
                    '3': 'hsl(var(--chart-3))',
                    '4': 'hsl(var(--chart-4))',
                    '5': 'hsl(var(--chart-5))'
                }
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)'
            },
            fontFamily: {
                dmSans: ['var(--font-dmSans)', 'sans-serif'], // Set as default
                cardo: ['var(--font-cardo)', 'sans-serif']
            }
        }
    },
     
    plugins: [require('tailwindcss-animate')]
} satisfies Config;
