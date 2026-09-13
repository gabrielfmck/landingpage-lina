'use client';

import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

import { BrandAsset } from '@/components/primitives/BrandAsset';
import { Button } from '@/components/ui/button';
import { ctaHref, ctaLabel, navItems } from '@/content/navigation';

import Link from 'next/link';

export interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  activeId?: string;
  session?: { id: number; email: string; nome: string } | null;
}

/**
 * `<dialog>` nativo, e não uma biblioteca de modal. O elemento já entrega trap
 * de foco, Esc para fechar e devolução do foco a quem abriu - três coisas que
 * uma implementação própria erra com facilidade - por zero byte de JavaScript
 * de terceiro. A presença animada é CSS, com `@starting-style` e
 * `transition-behavior: allow-discrete`, em `app/globals.css`.
 *
 * `open` é prop porque o estado do menu é do Header, que precisa dele para o
 * `aria-expanded` do botão. O efeito abaixo é a ponte entre esse estado de
 * React e o do elemento: `showModal()` e `close()` são imperativos, e o
 * `onClose` devolve o caminho de volta quando o usuário fecha por Esc.
 */
export function MobileMenu({ open, onClose, activeId, session }: Readonly<MobileMenuProps>) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [open]);

  // O diálogo modal torna o resto inerte, mas não trava a rolagem do documento:
  // sem isto a página corre atrás do menu aberto. Restaura o valor anterior em
  // vez de limpar, para não desfazer um overflow posto por outra coisa.
  useEffect(() => {
    if (!open) return;
    const { style } = document.documentElement;
    const previous = style.overflow;
    style.overflow = 'hidden';
    return () => {
      style.overflow = previous;
    };
  }, [open]);

  const effectiveCtaHref = session ? '/dashboard' : ctaHref;
  const effectiveCtaLabel = session ? 'Dashboard' : ctaLabel;

  return (
    <dialog
      ref={dialogRef}
      data-surface="deep"
      aria-label="Navegação"
      onClose={onClose}
      className="bg-lina-deep text-lina-paper m-0 h-full max-h-none w-full max-w-none p-0 backdrop:bg-transparent"
    >
      <div className="flex h-full flex-col p-6">
        <div className="flex items-center justify-between">
          <Link href="/" onClick={onClose} className="rounded-md">
            <BrandAsset variant="lockup-horizontal-reduzido-negativo" className="w-40" />
          </Link>
          <Button
            variant="inverse"
            size="icon"
            type="button"
            onClick={onClose}
            aria-label="Fechar navegação"
          >
            <X aria-hidden="true" />
          </Button>
        </div>

        <nav aria-label="Navegação principal" className="mt-10 flex-1">
          <ul className="flex flex-col gap-2">
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  href={`/${item.href}`}
                  onClick={onClose}
                  aria-current={activeId === item.id ? 'true' : undefined}
                  className="font-display block rounded-md py-2 text-2xl font-semibold aria-[current]:underline aria-[current]:underline-offset-8"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <Button asChild variant="inverse" size="lg" className="w-full">
          <Link href={effectiveCtaHref} onClick={onClose}>
            {effectiveCtaLabel}
          </Link>
        </Button>
      </div>
    </dialog>
  );
}
