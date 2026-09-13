import * as React from 'react';

import { cn } from '@/lib/utils';

export type CellGridColumns = 1 | 2 | 3 | 4 | 6;

// Lookup, não template string: o Tailwind precisa da classe escrita por
// inteiro no fonte. Contagem nova entra aqui e no tipo acima, nos dois.
const columnsClass: Record<CellGridColumns, string> = {
  1: 'md:grid-cols-1',
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
  6: 'md:grid-cols-6',
};

export interface CellGridProps extends React.ComponentPropsWithoutRef<'div'> {
  columns?: CellGridColumns;
  /**
   * Marca o grid como grupo de revelação por scroll: `Reveal` observa o
   * atributo `data-reveal-group` e a transição é toda CSS.
   *
   * O Hero desliga porque está acima da dobra e tem coreografia própria, em
   * `@keyframes`. Grupo acima da dobra com revelação por scroll já entra na
   * tela revelado, e o gesto se perde.
   */
  revelar?: boolean;
}

/**
 * O arranjo das células. O gap é sempre a costura - é ela que deixa o fundo
 * aparecer entre os blocos, e por isso não é configurável. Filhos com `span`
 * desigual são o ponto: o mosaico do logo não é uma fileira de cards iguais.
 *
 * Coluna única abaixo de `md`, onde a costura vira separação vertical.
 *
 * O escalonamento da revelação corre sobre os **filhos diretos**, pelo
 * `nth-child` das regras de `[data-reveal-group]` em `app/globals.css`.
 * Envolver as células num `<div>` intermediário junta todas num filho só e a
 * cascata some - para agrupar, use `span`, não wrapper. O teto é o 12º filho:
 * do 13º em diante todos entram juntos, no último passo.
 */
export function CellGrid({
  columns = 3,
  revelar = true,
  className,
  ...props
}: Readonly<CellGridProps>) {
  return (
    <div
      data-reveal-group={revelar ? '' : undefined}
      className={cn('gap-seam grid grid-cols-1', columnsClass[columns], className)}
      {...props}
    />
  );
}
