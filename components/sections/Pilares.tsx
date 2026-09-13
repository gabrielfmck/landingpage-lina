import { BracketLabel } from '@/components/primitives/BracketLabel';
import { Cell } from '@/components/primitives/Cell';
import { CellGrid } from '@/components/primitives/CellGrid';
import { SectionHeader } from '@/components/primitives/SectionHeader';
import { eixosPilares, pilares } from '@/content/pilares';
import type { Exigencia } from '@/content/pilares';

/**
 * A linha "O regimento exige: 60h anuais". O número vem separado do resto em
 * `content/pilares.ts` para receber `data-numeral` sem varrer o texto, e é
 * opcional: Pesquisa é a obrigação que não tem quantidade.
 */
function LinhaExigencia({ exigencia }: Readonly<{ exigencia: Exigencia }>) {
  return (
    <p className="text-on-surface-muted mt-6 text-sm">
      <span className="font-mono text-xs tracking-wide uppercase">
        {pilares.rotuloExigencia}
      </span>{' '}
      {exigencia.numero ? <span data-numeral>{exigencia.numero}</span> : null}
      {exigencia.numero && exigencia.resto ? ', ' : null}
      {exigencia.resto}.
    </p>
  );
}

/**
 * A célula escura é uma espinha estreita que atravessa as três linhas, e os
 * eixos são faixas largas apoiadas nela. A assimetria é 1 contra 3, nunca entre
 * os pilares: dar larguras diferentes a eles criaria hierarquia, que é
 * exatamente o contrário da indissociabilidade que a seção afirma.
 *
 * O `rowSpan={3}` da espinha conta os eixos de `content/pilares.ts`. Eixo a
 * mais ou a menos pede ajustar o rowSpan no mesmo commit, senão a espinha para
 * no meio da coluna ou estica para além do último eixo.
 */
export function Pilares() {
  return (
    <section
      id="pilares"
      data-surface="mist"
      aria-labelledby="pilares-titulo"
      className="bg-lina-mist px-6 py-24 md:py-32"
    >
      <div className="mx-auto w-full max-w-6xl">
        <SectionHeader
          id="pilares-titulo"
          label={pilares.eyebrow}
          title={pilares.titulo}
          className="max-w-3xl"
        />

        <CellGrid columns={4} className="mt-12">
          <Cell surface="deep" padding="lg" radius="lg" span={1} rowSpan={3}>
            <BracketLabel className="text-on-surface-muted">
              Indissociabilidade
            </BracketLabel>
            <p className="mt-6 text-base text-pretty">{pilares.espinha.paragrafo}</p>
            <p className="border-t-lina-mist/30 mt-6 border-t pt-6 text-sm">
              {pilares.espinha.simposio.antes}{' '}
              <span data-numeral>{pilares.espinha.simposio.numero}</span>.
            </p>
          </Cell>

          {eixosPilares.map((eixo) => (
            <Cell key={eixo.id} surface="paper" padding="lg" radius="lg" span={3}>
              <h3 className="font-display text-on-surface-display text-xl font-semibold md:text-2xl">
                {eixo.nome}
              </h3>
              <p className="mt-4 text-sm text-pretty md:text-base">{eixo.texto}</p>
              <LinhaExigencia exigencia={eixo.exigencia} />
            </Cell>
          ))}
        </CellGrid>
      </div>
    </section>
  );
}
