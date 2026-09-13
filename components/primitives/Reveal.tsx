'use client';

import { useEffect } from 'react';

/**
 * Observador único para toda a página: monta uma vez, observa cada
 * `[data-reveal-group]` e marca o grupo como revelado quando ele entra na
 * viewport. A transição e o escalonamento são CSS - daqui só sai o sinal.
 *
 * Um grupo revelado deixa de ser observado, então voltar ao topo não reanima.
 * O escalonamento fica dentro do grupo, nunca entre seções, porque cada
 * `CellGrid` é o seu próprio grupo.
 *
 * Duas guardas importantes **não** estão aqui, e sim no CSS: o estado escondido
 * de partida vive sob `@media (scripting: enabled)`, então sem JavaScript a
 * regra não casa e o conteúdo nasce visível; e `prefers-reduced-motion: reduce`
 * leva tudo ao estado final sem transição. Por isso este componente não
 * consulta nem uma coisa nem outra - procure em `app/globals.css`.
 *
 * Não renderiza nada. Monta uma vez só, em `app/layout.tsx`.
 */
export function Reveal() {
  useEffect(() => {
    const grupos = document.querySelectorAll<HTMLElement>('[data-reveal-group]');
    if (grupos.length === 0) return;

    // Sem suporte a observador, tudo já nasce no estado final.
    if (!('IntersectionObserver' in window)) {
      for (const grupo of grupos) grupo.dataset.revealed = '';
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.revealed = '';
          observer.unobserve(entry.target);
        }
      },
      // A margem negativa embaixo faz o grupo revelar quando já entrou de
      // verdade, e não no instante em que a primeira linha aparece.
      { rootMargin: '0px 0px -12% 0px', threshold: 0 },
    );

    for (const grupo of grupos) observer.observe(grupo);
    return () => observer.disconnect();
  }, []);

  return null;
}
