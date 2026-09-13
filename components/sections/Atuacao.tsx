import { Fragment } from 'react';

import { BracketLabel } from '@/components/primitives/BracketLabel';
import { Cell, type CellSpan } from '@/components/primitives/Cell';
import { CellGrid } from '@/components/primitives/CellGrid';
import { SectionHeader } from '@/components/primitives/SectionHeader';
import { gruposAtuacao, secaoAtuacao } from '@/content/atuacao';

// A largura da célula decorre do tamanho do grupo, e não de decoração: num
// grid de seis colunas, grupo de três divide a banda em terços e grupo de dois
// divide em metades. É daí que vem a densidade desigual do mosaico.
//
// Só esses dois tamanhos fecham a banda. Grupo de quatro ou mais em
// `content/atuacao.ts` cai no span 3 e deixa meia fileira vazia na última
// linha; se o conteúdo passar a pedir isso, o span vira campo do grupo em vez
// de cálculo daqui.
function spanDoGrupo(quantidade: number): CellSpan {
  return quantidade === 3 ? 2 : 3;
}

/**
 * Bandas horizontais - a única direção que as outras seções ainda não usaram.
 * Cada grupo é uma faixa escura de rótulo seguida das suas células claras.
 *
 * Os nove itens são nove células, não nove marcadores: o que carrega a
 * estrutura é o mosaico, e não a indentação. É o que impede a lista mais longa
 * do conteúdo de virar um rolo de bullets.
 */
export function Atuacao() {
  return (
    <section
      id="atuacao"
      data-surface="mist"
      aria-labelledby="atuacao-titulo"
      className="bg-lina-mist px-6 py-24 md:py-32"
    >
      <div className="mx-auto w-full max-w-6xl">
        <SectionHeader
          id="atuacao-titulo"
          label={secaoAtuacao.eyebrow}
          title={secaoAtuacao.titulo}
          className="max-w-3xl"
        />

        <CellGrid columns={6} className="mt-12">
          {gruposAtuacao.map((grupo) => (
            <Fragment key={grupo.id}>
              <Cell surface="deep" padding="sm" radius="md" span="full">
                <BracketLabel className="px-2">{grupo.nome}</BracketLabel>
              </Cell>

              {grupo.itens.map((item) => (
                <Cell
                  key={item.titulo}
                  surface="paper"
                  padding="lg"
                  radius="md"
                  span={spanDoGrupo(grupo.itens.length)}
                >
                  <h3 className="font-display text-on-surface-display text-base font-semibold">
                    {item.titulo}
                  </h3>
                  <p className="mt-3 text-sm text-pretty">{item.texto}</p>
                </Cell>
              ))}
            </Fragment>
          ))}
        </CellGrid>
      </div>
    </section>
  );
}
