import { BracketLabel } from '@/components/primitives/BracketLabel';
import { Cell, type CellSpan } from '@/components/primitives/Cell';
import { CellGrid } from '@/components/primitives/CellGrid';
import { Numerais } from '@/components/primitives/Numerais';
import { SectionHeader } from '@/components/primitives/SectionHeader';
import { gruposEquipe, secaoEquipe } from '@/content/equipe';
import { cn } from '@/lib/utils';

interface Arranjo {
  readonly span: CellSpan;
  readonly lista: string;
}

const arranjoPadrao: Arranjo = { span: 2, lista: 'flex flex-col gap-2' };

/**
 * Layout mora aqui, e não em `content/equipe.ts`: o conteúdo diz quem são os
 * grupos, a seção diz como eles se arranjam.
 *
 * A chave é o `id` do grupo. Grupo sem entrada usa `arranjoPadrao`, que é o
 * comportamento desejado - mas isso também significa que renomear um id em
 * `content/equipe.ts` sem mexer aqui devolve o grupo ao padrão sem nenhum
 * aviso do compilador.
 */
const arranjoPorGrupo: Record<string, Arranjo> = {
  membros: { span: 'full', lista: 'grid gap-2 sm:grid-cols-2 lg:grid-cols-4' },
};

/**
 * Assimetria descendente seguida de equilíbrio - 3+1, depois 2+2, depois a
 * fileira inteira.
 *
 * A estrutura é a célula maior porque responde à pergunta que independe de
 * nome. A eleição é estreita porque é fato curto e de alto valor: diz ao
 * candidato onde ele pode chegar.
 *
 * As duas células de orientadores têm o mesmo span mesmo com listas de tamanho
 * diferente - quatro nomes e dois: número de nomes não é hierarquia, e alargar
 * uma delas por isso seria uma afirmação que a fonte não faz. O grid estica as
 * duas à mesma altura, então a diferença aparece como folga dentro da célula
 * menor, que é o que ela é.
 *
 * A célula de membros é larga por ser a única da fileira, não por ter mais
 * nomes: em `span={2}` ela deixaria meia fileira vazia. Como é a única que
 * comporta mais de uma coluna de nomes, é também a única cuja lista vira grid.
 *
 * As células de pessoa são tipográficas e não reservam espaço de imagem.
 * Catorze formas vazias em fileira seriam o avatar quebrado que o projeto
 * proíbe.
 */
export function Equipe() {
  const { estrutura, eleicao } = secaoEquipe;

  return (
    <section
      id="equipe"
      data-surface="mist"
      aria-labelledby="equipe-titulo"
      className="bg-lina-mist px-6 py-24 md:py-32"
    >
      <div className="mx-auto w-full max-w-6xl">
        <SectionHeader
          id="equipe-titulo"
          label={secaoEquipe.eyebrow}
          title={secaoEquipe.titulo}
          className="max-w-3xl"
        />

        <CellGrid columns={4} className="mt-12">
          <Cell surface="deep" padding="lg" radius="lg" span={3}>
            <BracketLabel className="text-on-surface-muted">
              {estrutura.titulo}
            </BracketLabel>

            <dl className="mt-6 grid gap-x-10 gap-y-6 sm:grid-cols-2">
              {estrutura.orgaos.map((orgao) => (
                <div key={orgao.nome}>
                  <dt className="font-display text-on-surface-display text-base font-semibold">
                    {orgao.nome}
                  </dt>
                  <dd className="mt-1 text-sm text-pretty">{orgao.composicao}</dd>
                </div>
              ))}
            </dl>
          </Cell>

          <Cell surface="paper" padding="lg" radius="lg" span={1}>
            <BracketLabel className="text-on-surface-muted">
              {eleicao.titulo}
            </BracketLabel>
            <p className="mt-4 text-sm text-pretty">
              <Numerais texto={eleicao.texto} numeros={eleicao.numeros} />
            </p>
          </Cell>

          {gruposEquipe.map((grupo) => {
            const arranjo = arranjoPorGrupo[grupo.id] ?? arranjoPadrao;

            return (
              <Cell
                key={grupo.id}
                surface="paper"
                padding="lg"
                radius="lg"
                span={arranjo.span}
              >
                <BracketLabel className="text-on-surface-muted">
                  {grupo.rotulo}
                </BracketLabel>
                <ul className={cn('mt-4', arranjo.lista)}>
                  {grupo.pessoas.map((pessoa) => (
                    <li
                      key={pessoa.nome}
                      className="font-display text-on-surface-display text-base font-semibold text-balance"
                    >
                      {pessoa.nome}
                      {pessoa.cargo ? (
                        <span className="text-on-surface-muted block font-mono text-xs font-normal">
                          {pessoa.cargo}
                        </span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </Cell>
            );
          })}
        </CellGrid>
      </div>
    </section>
  );
}
