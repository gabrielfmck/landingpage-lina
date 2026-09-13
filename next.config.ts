import path from 'node:path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Removido output: 'export' para permitir Server Actions, upload de arquivos e banco de dados.
  trailingSlash: true,
  // Limite aumentado para Server Actions permitindo uploads de até 20MB por arquivo (40MB+ total)
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },
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
