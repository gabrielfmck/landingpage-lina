'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Observador único para toda a página com suporte completo a client-side navigation
 * e navegação por âncoras (#).
 * Revela os componentes conforme entram na viewport durante o scroll, mas garante
 * que tudo que já está visível ou acima da dobra apareça imediatamente e sem travar.
 */
export function Reveal() {
  const pathname = usePathname();

  useEffect(() => {
    const grupos = [...document.querySelectorAll<HTMLElement>('[data-reveal-group]')];
    if (grupos.length === 0) return;

    // Sem suporte a IntersectionObserver, tudo nasce no estado final visível
    if (!('IntersectionObserver' in window)) {
      for (const grupo of grupos) grupo.dataset.revealed = '';
      return;
    }

    // Revela imediatamente tudo que já estiver visível na tela ou acima do scroll
    const revelarVisiveis = () => {
      const windowHeight = window.innerHeight;
      for (const grupo of grupos) {
        if ('revealed' in grupo.dataset) continue;
        const rect = grupo.getBoundingClientRect();
        if (rect.top <= windowHeight * 0.95 && rect.bottom >= 0) {
          grupo.dataset.revealed = '';
        }
      }
    };

    revelarVisiveis();

    // Observador para revelar os componentes progressivamente durante o scroll
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const target = entry.target as HTMLElement;
          target.dataset.revealed = '';
          observer.unobserve(target);
        }
      },
      { rootMargin: '0px 0px -20px 0px', threshold: 0.01 },
    );

    for (const grupo of grupos) {
      if (!('revealed' in grupo.dataset)) {
        observer.observe(grupo);
      }
    }

    // Ouvintes para eventos de scroll e mudança de âncora (#)
    window.addEventListener('scroll', revelarVisiveis, { passive: true });
    window.addEventListener('hashchange', revelarVisiveis, { passive: true });

    // Fallback de segurança: após 1.2s, garante que nenhum componente fique invisível
    const fallbackTimer = setTimeout(() => {
      for (const grupo of grupos) {
        grupo.dataset.revealed = '';
      }
    }, 1200);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', revelarVisiveis);
      window.removeEventListener('hashchange', revelarVisiveis);
      clearTimeout(fallbackTimer);
    };
  }, [pathname]);

  return null;
}
