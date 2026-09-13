// eslint-config-next 16 já exporta flat config nativo - sem FlatCompat.
import coreWebVitals from 'eslint-config-next/core-web-vitals';
import next from 'eslint-config-next';
import typescript from 'eslint-config-next/typescript';

const config = [
  { ignores: ['.next/**', 'out/**', 'node_modules/**', 'next-env.d.ts'] },
  ...next,
  ...coreWebVitals,
  ...typescript,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/ban-ts-comment': 'error',
      '@typescript-eslint/consistent-type-imports': 'error',
    },
  },
];

export default config;
