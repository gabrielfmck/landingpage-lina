'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Id da seção que cruza a faixa central da viewport. A margem negativa cima e
 * baixo estreita a área de decisão, para que a seção ativa mude uma vez só e no
 * momento em que o leitor realmente chega nela.
 */
export function useActiveSection(ids: readonly string[]) {
  const pathname = usePathname();
  const [activeId, setActiveId] = useState<string | undefined>(undefined);

  useEffect(() => {
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const visible = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        // Mantém a ordem do documento, não a ordem em que o observador disparou.
        setActiveId(ids.find((id) => visible.has(id)));
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    );

    for (const section of sections) observer.observe(section);
    return () => observer.disconnect();
  }, [ids, pathname]);

  return activeId;
}

/**
 * Altura do header em pixels, lida de `--spacing-header` no próprio CSS - a
 * altura não pode existir como número em dois lugares. O token está em `rem`,
 * então o valor é multiplicado pela font-size da raiz.
 *
 * O 80 do fallback é o token convertido, e só entra se o CSS ainda não tiver
 * aplicado. Mudou o token, mude este número junto.
 */
function alturaDoHeader() {
  const raiz = document.documentElement;
  const estilo = getComputedStyle(raiz);
  const declarado = estilo.getPropertyValue('--spacing-header').trim();
  const valor = Number.parseFloat(declarado);

  if (!Number.isFinite(valor)) return 80;
  if (declarado.endsWith('rem')) return valor * Number.parseFloat(estilo.fontSize);
  return valor;
}

/**
 * Qual seção está passando por baixo do header, pelo `data-surface` dela.
 *
 * As margens negativas recortam a raiz do observador até uma faixa de 1px
 * colada na borda inferior do header: "estar sob o header" é literalmente isso,
 * e não uma aproximação por posição de scroll. Daí sai a única decisão do
 * header - qual das suas duas superfícies usar.
 *
 * Só enxerga `main > [data-surface]`. Seção nova sem esse atributo, ou aninhada
 * mais fundo, não é observada: o header simplesmente mantém a superfície da
 * seção anterior enquanto passa por ela.
 *
 * O observador é refeito a cada `resize` porque a faixa depende de
 * `window.innerHeight`.
 *
 * O `fallback` é o que vai no HTML estático, antes de o observador existir -
 * use a superfície da primeira seção da página. O porquê está em `Header.tsx`.
 */
export function useSecaoSobOHeader(fallback: string) {
  const pathname = usePathname();
  const [surface, setSurface] = useState(fallback);

  useEffect(() => {
    let observer: IntersectionObserver | undefined;

    const connect = () => {
      observer?.disconnect();
      const headerHeight = alturaDoHeader();
      const abaixo = Math.max(0, window.innerHeight - headerHeight - 1);
      const secoes = [...document.querySelectorAll<HTMLElement>('main > [data-surface]')];

      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            const abaixo = (entry.target as HTMLElement).dataset.surface;
            if (abaixo) setSurface(abaixo);
          }
        },
        { rootMargin: `-${headerHeight}px 0px -${abaixo}px 0px`, threshold: 0 },
      );

      for (const secao of secoes) observer.observe(secao);
    };

    connect();
    window.addEventListener('resize', connect);
    return () => {
      window.removeEventListener('resize', connect);
      observer?.disconnect();
    };
  }, [fallback, pathname]);

  return surface;
}
