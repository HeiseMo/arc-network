/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Cassette Futurism Palette
        steel: {
          DEFAULT: '#767A7F',
          light: '#A0A3A8',
          dark: '#5A5D62',
        },
        denim: {
          DEFAULT: '#33536B',
          light: '#667C8E',
          dark: '#243A4D',
        },
        olive: {
          DEFAULT: '#828D6D',
          dark: '#576150',
        },
        rust: {
          DEFAULT: '#783E3D',
          dark: '#522b2e',
        },
        vintage: {
          white: '#E3E1D9',
          cream: '#D6D3C2',
        },
        signal: {
          orange: '#EF6F2C',
          ochre: '#B55F30',
          red: '#C44536',
        },
      },
      fontFamily: {
        mono: ['Space Mono', 'monospace'],
        display: ['Eurostile Extended', 'Rajdhani', 'sans-serif'],
        body: ['IBM Plex Mono', 'monospace'],
      },
      backgroundImage: {
        'grain': "url('data:image/svg+xml,%3Csvg viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"noiseFilter\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"4.5\" numOctaves=\"3\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23noiseFilter)\" opacity=\"0.08\"/%3E%3C/svg%3E')",
        'scanlines': 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.1) 2px, rgba(0, 0, 0, 0.1) 4px)',
      },
      boxShadow: {
        'crt': '0 0 20px rgba(51, 83, 107, 0.3), inset 0 0 10px rgba(0, 0, 0, 0.5)',
        'bezel': 'inset 0 2px 4px rgba(0, 0, 0, 0.6), 0 1px 2px rgba(255, 255, 255, 0.1)',
        'tactical': '0 2px 0 rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      },
      animation: {
        'flicker': 'flicker 0.15s infinite',
        'glitch': 'glitch 0.3s cubic-bezier(.25, .46, .45, .94) both',
        'scanline': 'scanline 8s linear infinite',
        'fadeIn': 'fadeIn 0.2s ease-out',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
