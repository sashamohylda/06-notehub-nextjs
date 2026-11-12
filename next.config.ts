import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Класична модель SSR, як у курсі: сторінки з даними рендеряться на кожен запит
  cacheComponents: false,
  // У домашній папці лежить сторонній package-lock.json — явно вказуємо корінь проєкту
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
