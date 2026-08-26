import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        serif: [
          '"Songti SC"',
          '"STSong"',
          '"Source Han Serif SC"',
          '"Source Han Serif CN"',
          'SimSun',
          '"Noto Serif CJK SC"',
          'serif',
        ],
        sans: [
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          '"PingFang SC"',
          '"Hiragino Sans GB"',
          '"Microsoft YaHei"',
          'Roboto',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [
    typography,
  ],
};

