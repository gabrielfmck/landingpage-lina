import * as React from 'react';

import { cn } from '@/lib/utils';

export interface BracketLabelProps extends React.ComponentPropsWithoutRef<'span'> {
  children: React.ReactNode;
}

/**
 * O eyebrow da marca: o motivo `< FACOM - UFU` do lockup virando sistema.
 * Um por seção, no máximo.
 *
 * O `<` é decorativo e fica fora da árvore de acessibilidade - leitor de tela
 * não deve anunciar "menor que" antes de cada label. A cor é herdada da Cell,
 * o que garante contraste em qualquer superfície sem lógica condicional.
 */
export function BracketLabel({
  className,
  children,
  ...props
}: Readonly<BracketLabelProps>) {
  return (
    <span
      className={cn(
        'tracking-bracket font-mono text-xs font-medium uppercase',
        className,
      )}
      {...props}
    >
      <span aria-hidden="true">{'< '}</span>
      {children}
    </span>
  );
}
