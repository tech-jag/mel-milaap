import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				success: {
					DEFAULT: 'hsl(var(--success))',
					foreground: 'hsl(var(--success-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				// Luxury Palette
				lux: {
					ivory: 'hsl(var(--lux-ivory))',
					porcelain: 'hsl(var(--lux-porcelain))',
					oxblood: 'hsl(var(--lux-oxblood))',
					champagne: 'hsl(var(--lux-champagne))',
					onyx: 'hsl(var(--lux-onyx))',
					blush: 'hsl(var(--lux-blush))',
					emerald: 'hsl(var(--lux-emerald))'
				}
			},
			fontFamily: {
				heading: ['var(--font-heading)', 'serif'],
				body: ['var(--font-body)', 'sans-serif']
			},
			backgroundImage: {
				'gradient-primary': 'var(--gradient-primary)',
				'gradient-champagne': 'var(--gradient-champagne)',
				'gradient-hero': 'var(--gradient-hero)',
				'gradient-card': 'var(--gradient-card)'
			},
			boxShadow: {
				'luxury': 'var(--shadow-luxury)',
				'elegant': 'var(--shadow-elegant)',
				'soft': 'var(--shadow-soft)',
				'champagne': 'var(--shadow-champagne)'
			},
			transitionTimingFunction: {
				'luxury': 'cubic-bezier(0.4, 0, 0.2, 1)',
				'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
				'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)'
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
