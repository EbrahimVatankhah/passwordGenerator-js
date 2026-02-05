        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
                        mono: ['"JetBrains Mono"', 'monospace'],
                    },
                    colors: {
                        glass: {
                            100: 'rgba(255, 255, 255, 0.05)',
                            200: 'rgba(255, 255, 255, 0.1)',
                            border: 'rgba(255, 255, 255, 0.08)',
                        },
                        accent: {
                            DEFAULT: '#6366f1', // Indigo 500
                            hover: '#4f46e5',   // Indigo 600
                            glow: 'rgba(99, 102, 241, 0.5)'
                        }
                    },
                    animation: {
                        'pop': 'pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                        'slide-up': 'slideUp 0.4s ease-out forwards',
                    },
                    keyframes: {
                        pop: {
                            '0%': { transform: 'scale(0.9)' },
                            '100%': { transform: 'scale(1)' },
                        },
                        slideUp: {
                            '0%': { opacity: '0', transform: 'translateY(10px)' },
                            '100%': { opacity: '1', transform: 'translateY(0)' },
                        }
                    }
                }
            }
        }