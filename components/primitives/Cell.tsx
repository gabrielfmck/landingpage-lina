import * as React from 'react';

import { cn } from '@/lib/utils';

export type CellSurface = 'paper' | 'mist' | 'deep' | 'royal' | 'ia' | 'r' | 'ml';
export type CellPadding = 'none' | 'sm' | 'md' | 'lg';
export type CellRadius = 'sm' | 'md' | 'lg';
export type CellSpan = 1 | 2 | 3 | 4 | 5 | 6 | 'full';
export type CellRowSpan = 2 | 3 | 4;

// Os mapas deste arquivo são lookup em objeto, e não template string, porque o
// Tailwind lê o código-fonte como texto e só gera a classe que encontrar
// escrita por inteiro. `md:col-span-${span}` compila, passa no lint e não
// produz CSS nenhum. Vale para todo o projeto: classe variável aparece literal
// num mapa como estes.
//
// Este primeiro é só o preenchimento. A cor do texto vem do slot
// `--lina-surface-fg`, que o próprio `data-surface` declara: existe uma
// definição só de "qual cor de texto esta superfície pede", e quem precisa dela
// dinamicamente - o Header e o cursor - lê do mesmo lugar.
const surfaceClass: Record<CellSurface, string> = {
  paper: 'bg-lina-paper',
  mist: 'bg-lina-mist',
  deep: 'bg-lina-deep',
  royal: 'bg-lina-royal',
  ia: 'bg-lina-ia',
  r: 'bg-lina-r',
  ml: 'bg-lina-ml',
};

const paddingClass: Record<CellPadding, string> = {
  none: 'p-0',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8 md:p-10',
};

const radiusClass: Record<CellRadius, string> = {
  sm: 'rounded-cell-sm',
  md: 'rounded-cell',
  lg: 'rounded-cell-lg',
};

// Só tem efeito dentro de um CellGrid, e só a partir de md - abaixo disso o
// grid é de coluna única e span não faz sentido. O valor precisa caber no
// `columns` do grid que a envolve: span 4 num grid de 3 colunas transborda para
// a linha seguinte em vez de erro.
const spanClass: Record<CellSpan, string> = {
  1: 'md:col-span-1',
  2: 'md:col-span-2',
  3: 'md:col-span-3',
  4: 'md:col-span-4',
  5: 'md:col-span-5',
  6: 'md:col-span-6',
  full: 'md:col-span-full',
};

// Também só dentro de CellGrid e só a partir de md. Serve para a célula que
// sustenta uma pilha de irmãs - a espinha de `Pilares` é o caso.
const rowSpanClass: Record<CellRowSpan, string> = {
  2: 'md:row-span-2',
  3: 'md:row-span-3',
  4: 'md:row-span-4',
};

export interface CellProps extends React.ComponentPropsWithoutRef<'div'> {
  surface?: CellSurface;
  padding?: CellPadding;
  radius?: CellRadius;
  span?: CellSpan;
  rowSpan?: CellRowSpan;
}

/**
 * A superfície fundamental da página: um bloco de cantos arredondados que deixa
 * o fundo aparecer ao seu redor. Células adjacentes ficam separadas pela
 * costura de `CellGrid`, e é nessa fresta que a superfície de baixo aparece.
 *
 * Emite `data-surface`, que redeclara os quatro slots de superfície definidos
 * em `app/globals.css`: offset do anel de foco, texto, título e secundário.
 * Como custom property herda, qualquer aninhamento resolve sozinho - o anel de
 * foco de um botão pega o offset da Cell mais próxima, e não o da seção, e os
 * utilitários `text-on-surface*` funcionam em qualquer profundidade.
 *
 * Superfície nova é um contrato entre três arquivos: o tipo `CellSurface` e o
 * mapa `surfaceClass` aqui, o bloco `[data-surface='…']` com os quatro slots em
 * `app/globals.css`, e o mapa `HEADER_SOLIDO` em `components/layout/Header.tsx`.
 * Os três estão comentados; comece por `globals.css`.
 */
export function Cell({
  surface = 'paper',
  padding = 'md',
  radius = 'md',
  span,
  rowSpan,
  className,
  ...props
}: Readonly<CellProps>) {
  return (
    <div
      data-surface={surface}
      className={cn(
        'text-on-surface',
        surfaceClass[surface],
        radiusClass[radius],
        paddingClass[padding],
        span !== undefined && spanClass[span],
        rowSpan !== undefined && rowSpanClass[rowSpan],
        className,
      )}
      {...props}
    />
  );
}
