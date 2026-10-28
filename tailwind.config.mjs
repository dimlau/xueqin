import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        // 拉丁字母交给 Georgia，中文回落到宋体，避免西文也吃宋体的窄字形
        serif: [
          'Georgia',
          '"Nimbus Roman No9 L"',
          '"Songti SC"',
          '"STSong"',
          '"Source Han Serif SC"',
          '"Source Han Serif CN"',
          '"Noto Serif CJK SC"',
          'SimSun',
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
      typography: {
        DEFAULT: {
          css: {
            // 随视口从 17px 平滑过渡到 19px，接近 kaix.in 的 18–20px 正文
            fontSize: 'clamp(1.0625rem, 0.9rem + 0.5vw, 1.1875rem)',
            lineHeight: '1.9',
            letterSpacing: '0.02em',
            maxWidth: 'none',
            textWrap: 'pretty',
            p: {
              marginTop: '0',
              marginBottom: '1.55em',
              textAlign: 'justify',
              textJustify: 'inter-ideograph',
            },
            'p:first-child': { marginTop: '0' },
            'p:last-child': { marginBottom: '0' },
            a: {
              textUnderlineOffset: '0.2em',
              textDecorationThickness: '1px',
            },
            strong: { fontWeight: '700' },
            'ul, ol': {
              paddingLeft: '1.25em',
              marginTop: '0.8em',
              marginBottom: '1.2em',
            },
            li: {
              marginTop: '0.4em',
              marginBottom: '0.4em',
              lineHeight: '1.8',
            },
            'li > p': {
              marginTop: '0.4em',
              marginBottom: '0.4em',
            },
            blockquote: {
              fontStyle: 'normal',
              fontWeight: '400',
              lineHeight: '1.85',
              paddingLeft: '1.25em',
              borderLeftWidth: '3px',
            },
            'blockquote p:first-of-type::before': { content: 'none' },
            'blockquote p:last-of-type::after': { content: 'none' },
            h2: {
              fontSize: '1.35em',
              lineHeight: '1.55',
              marginTop: '2.2em',
              marginBottom: '0.8em',
              letterSpacing: '0.01em',
              textWrap: 'balance',
            },
            h3: {
              fontSize: '1.15em',
              lineHeight: '1.55',
              marginTop: '1.9em',
              marginBottom: '0.6em',
              letterSpacing: '0.01em',
              textWrap: 'balance',
            },
            h4: {
              fontSize: '1.05em',
              lineHeight: '1.55',
              marginTop: '1.6em',
              marginBottom: '0.5em',
              textWrap: 'balance',
            },
            hr: {
              marginTop: '2.5em',
              marginBottom: '2.5em',
            },
            'figure figcaption': {
              fontSize: '0.85em',
              lineHeight: '1.7',
              letterSpacing: '0.02em',
            },
            code: { fontSize: '0.9em' },
            'code::before': { content: 'none' },
            'code::after': { content: 'none' },
            table: { fontSize: '0.95em' },
          },
        },
      },
    },
  },
  plugins: [
    typography,
  ],
};
