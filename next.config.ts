import path from 'node:path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Build estático: não há servidor, middleware nem route handler no alvo.
  output: 'export',
  // Gera um diretório por rota com index.html - mantém o try_files do Nginx trivial.
  trailingSlash: true,
  // Obrigatório com output: 'export'. Os assets de marca são SVG servidos direto.
  images: { unoptimized: true },
  // Fixa a raiz do workspace: sem isto o Turbopack sobe a árvore e encontra
  // lockfiles fora do repositório.
  turbopack: { root: path.resolve(import.meta.dirname) },
  // O Next 16 escreve arquivos de instrução na raiz a cada `next dev`; este
  // repositório não os versiona.
  agentRules: false,
  reactStrictMode: true,
  typedRoutes: true,
};

export default nextConfig;
