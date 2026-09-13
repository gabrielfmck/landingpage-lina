'use client';

import { useCallback, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Menu, LayoutDashboard } from 'lucide-react';

import { BrandAsset } from '@/components/primitives/BrandAsset';
import { MobileMenu } from '@/components/layout/MobileMenu';
import { useActiveSection, useSecaoSobOHeader } from '@/components/layout/useHeaderState';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ctaHref, ctaLabel, navItems } from '@/content/navigation';

/** Superfícies escuras pedem CTA preenchido em paper; claras pedem electric. */
const DARK_SURFACES = new Set(['deep', 'royal']);

/**
 * Superfície da seção → superfície do header **sólido**. É mapeamento
 * explícito, não adoção: se o header herdasse a superfície da seção, uma
 * divisão passando por baixo produziria um header ciano ou magenta. Superfície
 * nova entra aqui por decisão consciente, nunca por acidente.
 *
 * A chave é `string`, e não `CellSurface`, então o TypeScript não cobra quando
 * falta uma: superfície que não entrar aqui cai no `?? 'paper'` mais abaixo e o
 * header fica claro por omissão - sobre uma seção escura isso é branco sobre
 * branco. Se preferir que o compilador cobre, tipar a chave é uma linha.
 */
const HEADER_SOLIDO: Record<string, 'paper' | 'deep'> = {
  paper: 'paper',
  mist: 'paper',
  deep: 'deep',
  royal: 'deep',
  ia: 'paper',
  r: 'paper',
  ml: 'paper',
};

/**
 * Fixo e sempre opaco, mapeando a superfície da seção que passa por baixo dele
 * para uma das suas duas: clara ou escura.
 *
 * Não existe estado transparente, e isso é deliberado. Com o hero passando por
 * baixo, as células claras do mosaico deslizavam atrás de um header sem fundo e
 * a navegação ficava branco sobre branco por cerca de 800px de rolagem. Sobre o
 * hero a barra é `deep` sobre seção `deep`, então no repouso a imagem é a mesma
 * - o que muda é o conteúdo parar de atravessá-la. Se um dia a transparência
 * voltar, confira a página inteira de cima a baixo: a colisão acontece no meio
 * da travessia entre seções, e não nas posições em que se costuma olhar.
 *
 * O fio inferior é `royal` sobre `deep` (1.58) e `mist` sobre `paper` (1.11).
 * Os dois se fundem de propósito: o marcador da barra não é o fio, é o conteúdo
 * desaparecendo na borda dela. Fio mais forte num estado criaria assimetria
 * entre os dois sem justificativa.
 *
 * A altura sai de `h-header`, do token `--spacing-header`. O mesmo token dá o
 * `scroll-margin-top` das âncoras e é lido em runtime por `useSecaoSobOHeader`:
 * é um número só, e mexer nele move os três de uma vez.
 */
export interface HeaderProps {
  session?: { id: number; email: string; nome: string } | null;
}

export function Header({ session }: HeaderProps) {
  const pathname = usePathname();
  const sectionIds = useMemo(() => navItems.map((item) => item.id), []);
  const activeId = useActiveSection(sectionIds);
  const surfaceAbaixo = useSecaoSobOHeader('deep');
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const surface = HEADER_SOLIDO[surfaceAbaixo] ?? 'paper';
  const onDark = DARK_SURFACES.has(surface);

  const effectiveCtaHref = session
    ? '/dashboard'
    : pathname === '/'
      ? ctaHref
      : `/${ctaHref}`;
  const effectiveCtaLabel = session ? 'Dashboard' : ctaLabel;

  return (
    <>
      <header
        data-surface={surface}
        className="text-on-surface data-[surface=paper]:bg-lina-paper data-[surface=paper]:border-b-lina-mist data-[surface=deep]:bg-lina-deep data-[surface=deep]:border-b-lina-royal h-header fixed inset-x-0 top-0 z-40 border-b"
      >
        <div className="mx-auto flex h-full max-w-6xl items-center justify-between gap-6 px-6">
          <Link href="/" aria-label="LINA - início" className="rounded-md">
            <BrandAsset
              variant="lockup-horizontal-reduzido"
              alt=""
              loading="eager"
              className={cn('w-36', onDark && 'hidden')}
            />
            <BrandAsset
              variant="lockup-horizontal-reduzido-negativo"
              alt=""
              loading="eager"
              className={cn('w-36', !onDark && 'hidden')}
            />
          </Link>

          <nav aria-label="Navegação principal" className="hidden lg:block">
            <ul className="flex items-center gap-6">
              {navItems.map((item) => {
                const itemHref = pathname === '/' ? item.href : `/${item.href}`;
                return (
                  <li key={item.id}>
                    <a
                      href={itemHref}
                      aria-current={activeId === item.id ? 'true' : undefined}
                      className="rounded-md text-sm font-medium aria-[current]:underline aria-[current]:underline-offset-8"
                    >
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <Button
              asChild
              variant={onDark ? 'inverse' : 'solid'}
              className="hidden sm:inline-flex"
            >
              <Link href={effectiveCtaHref} className="inline-flex items-center gap-2">
                {session && <LayoutDashboard className="size-4" aria-hidden="true" />}
                {effectiveCtaLabel}
              </Link>
            </Button>

            <Button
              variant={onDark ? 'inverse' : 'ghost'}
              size="icon"
              type="button"
              className="lg:hidden"
              aria-label="Abrir navegação"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(true)}
            >
              <Menu aria-hidden="true" />
            </Button>
          </div>
        </div>
      </header>

      <MobileMenu
        open={menuOpen}
        onClose={closeMenu}
        activeId={activeId}
        session={session}
      />
    </>
  );
}
