import type { Metadata } from 'next';
import { Sora, Inter_Tight, JetBrains_Mono } from 'next/font/google';

import { Header } from '@/components/layout/Header';
import { Cursor } from '@/components/primitives/Cursor';
import { Reveal } from '@/components/primitives/Reveal';
import { instituicao } from '@/content/institucional';
import { organizationJsonLd } from '@/lib/seo';
import { getSession } from '@/lib/session';
import './globals.css';

const sora = Sora({ subsets: ['latin'], display: 'swap', variable: '--font-sora' });

const interTight = Inter_Tight({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter-tight',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
});

// O título compõe com o nome institucional em vez de repetir a string: o nome
// existe em um lugar só e a metadata nunca diverge do rodapé.
const title = `${instituicao.nomeCompleto} · FACOM/UFU`;
const description =
  'Liga acadêmica de Robótica e Inteligência Artificial da Faculdade de Computação da UFU. Associação científica criada por estudantes, sob coordenação docente, com ensino, pesquisa e extensão em IA, robótica e machine learning.';

export const metadata: Metadata = {
  metadataBase: new URL(instituicao.url),
  title,
  description,
  applicationName: instituicao.nome,
  alternates: { canonical: '/' },
  // Sem `images`: os assets da marca chegaram, mas Open Graph pede raster
  // (1200x630) e a identidade entregou SVG. A imagem de OG é peça à parte, e
  // enquanto não existir é melhor não declarar campo nenhum - link
  // compartilhado sem imagem é pior com imagem quebrada. O `logo` do JSON-LD em
  // `lib/seo.ts` está parado pelo mesmo motivo.
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: instituicao.url,
    siteName: instituicao.nomeCompleto,
    title,
    description,
  },
  twitter: {
    card: 'summary',
    title,
    description,
  },
  robots: { index: true, follow: true },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getSession();

  return (
    <html
      lang="pt-BR"
      className={`${sora.variable} ${interTight.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <a
          href="#conteudo"
          className="bg-lina-paper text-lina-ink sr-only rounded-md px-4 py-2 text-sm font-medium focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50"
        >
          Pular para o conteúdo
        </a>

        <Header session={session} />
        {children}

        {/* Nenhum dos dois renderiza nada: montam um observador e um par de
            elementos de cursor, uma vez só para a página inteira. Ficam no fim
            do body porque precisam do conteúdo já no documento, e cada um traz
            as próprias guardas - ver o cabeçalho de cada arquivo. */}
        <Reveal />
        <Cursor />

        <script
          type="application/ld+json"
          // JSON-LD precisa ir cru; o conteúdo é gerado por nós, não vem de input.
          dangerouslySetInnerHTML={{ __html: organizationJsonLd() }}
        />
      </body>
    </html>
  );
}
