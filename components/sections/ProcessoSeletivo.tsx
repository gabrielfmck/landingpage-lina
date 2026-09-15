import { Fragment } from 'react';

import { BracketLabel } from '@/components/primitives/BracketLabel';
import { Cell } from '@/components/primitives/Cell';
import { CellGrid } from '@/components/primitives/CellGrid';
import { SectionHeader } from '@/components/primitives/SectionHeader';
import { Numerais } from '@/components/primitives/Numerais';
import Link from 'next/link';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { inscricoesAbertas, processoSeletivo } from '@/content/processo-seletivo';

/**
 * A peça de conversão. Segunda e última seção escura, fechando a simetria com o
 * hero: a página abre com a tese e fecha o argumento com a ação.
 *
 * A composição é 1 → 3 → 2 → 1 → 2+2 → 2 → 1, num grid de seis colunas.
 * Célula pequena é fato que o leitor confere em si mesmo; célula larga é
 * afirmação que pesa. O quarteto numerado quebra o ritmo de propósito, porque
 * depois do porquê vem a sequência, e os dois pares de span 3 o emolduram: o de
 * cima são as regras, o de baixo é o que vem depois de passar.
 *
 * O `3` são os três requisitos de `content/processo-seletivo.ts`, cada um em
 * span 2 fechando uma fileira. Requisito a mais ou a menos deixa a fileira
 * quebrada, e aí o span deles precisa ser recalculado.
 *
 * **A ação abre a seção, e não a fecha.** Guardar a inscrição para o fim custa
 * 2.300px de rolagem entre o clique do CTA e o botão, 4.200px no mobile. Quem
 * chega aqui já leu a página inteira e o argumento está feito: o que a seção
 * deve ao visitante é o prazo e o formulário, com os requisitos logo abaixo
 * para ele conferir antes de clicar. Não devolva a célula de inscrição para o
 * fim da seção.
 *
 * As duas células de `mist` são as duas cujo conteúdo muda a cada ciclo:
 * inscrição na abertura, cronograma no fecho. Elas emolduram o que é
 * permanente.
 *
 * `inscricoesAbertas`, em `content/processo-seletivo.ts`, é a chave do ciclo.
 * Ela decide aqui o texto da célula de abertura e a existência do botão do
 * formulário, e fora daqui a linha de status do Hero e o rótulo do CTA. O build
 * é estático e não calcula "hoje": passado o prazo, alguém precisa virar a
 * chave e rebuildar.
 */
export function ProcessoSeletivo() {
  const {
    requisitos,
    permanencia,
    justificativa,
    declaracao,
    etapas,
    prova,
    experiencia,
    cronograma,
    inscricao,
  } = processoSeletivo;
  const ultimo = declaracao.consta.length - 1;
  const estado = inscricoesAbertas ? inscricao.aberta : inscricao.encerrada;

  return (
    <section
      id="processo-seletivo"
      data-surface="deep"
      aria-labelledby="processo-seletivo-titulo"
      className="bg-lina-deep px-6 py-24 md:py-32"
    >
      <div className="mx-auto w-full max-w-6xl">
        <SectionHeader
          id="processo-seletivo-titulo"
          label={processoSeletivo.eyebrow}
          title={processoSeletivo.titulo}
          className="max-w-3xl"
        />

        <CellGrid columns={6} className="mt-12">
          <Cell surface="mist" padding="lg" radius="md" span="full">
            <BracketLabel className="text-on-surface-muted">
              {inscricao.titulo}
            </BracketLabel>

            <p className="mt-4 max-w-4xl text-base text-pretty md:text-lg">
              <Numerais texto={estado.texto} numeros={estado.numeros} />
            </p>

            <p className="mt-3 max-w-4xl text-sm text-pretty">
              <Numerais texto={inscricao.vagas.texto} numeros={inscricao.vagas.numeros} />
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              {inscricoesAbertas ? (
                <Button asChild size="lg">
                  <Link href={inscricao.acao.href}>
                    {inscricao.acao.rotulo}
                  </Link>
                </Button>
              ) : null}

              <Button asChild variant="outline" size="lg">
                <a
                  href="/edital.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  download="Edital_01_2026_LINA.pdf"
                  className="inline-flex items-center gap-2"
                >
                  <Download className="size-4" aria-hidden="true" />
                  Fazer download do edital
                </a>
              </Button>
            </div>

            <p className="border-t-lina-ink/10 mt-6 max-w-4xl border-t pt-4 text-sm">
              {inscricao.contato.antes}{' '}
              <a
                href={`mailto:${inscricao.contato.email}`}
                className="rounded-md font-semibold underline underline-offset-4"
              >
                {inscricao.contato.email}
              </a>
              . {inscricao.contato.depois}
            </p>
          </Cell>

          {requisitos.map((requisito) => (
            <Cell
              key={requisito.titulo}
              surface="paper"
              padding="lg"
              radius="md"
              span={2}
            >
              <h3 className="font-display text-on-surface-display text-base font-semibold">
                {requisito.titulo}
              </h3>
              <p className="mt-3 text-sm text-pretty">
                <Numerais texto={requisito.texto} numeros={requisito.numeros} />
              </p>
            </Cell>
          ))}

          {[permanencia, justificativa].map((bloco) => (
            <Cell key={bloco.titulo} surface="paper" padding="lg" radius="md" span={3}>
              <h3 className="font-display text-on-surface-display text-base font-semibold">
                {bloco.titulo}
              </h3>
              <p className="mt-3 text-sm text-pretty">
                <Numerais texto={bloco.texto} numeros={bloco.numeros} />
              </p>
            </Cell>
          ))}

          <Cell surface="paper" padding="lg" radius="lg" span="full">
            <BracketLabel className="text-on-surface-muted">
              {declaracao.titulo}
            </BracketLabel>

            <p className="mt-4 max-w-4xl text-base text-pretty md:text-lg">
              {declaracao.paragrafo}
            </p>

            <p className="mt-4 max-w-4xl text-base md:text-lg">
              {declaracao.constamAntes}{' '}
              {declaracao.consta.map((item, indice) => (
                <Fragment key={item.termo}>
                  {indice === ultimo && ultimo > 0 ? 'e ' : null}
                  {item.artigo} <strong className="font-semibold">{item.termo}</strong>
                  {indice < ultimo - 1 ? ', ' : null}
                  {indice === ultimo - 1 ? ' ' : null}
                </Fragment>
              ))}
              .
            </p>

            <p className="border-t-lina-mist/40 mt-6 border-t pt-4 text-sm font-semibold">
              {declaracao.complementares} {declaracao.limite}
            </p>
          </Cell>

          {etapas.map((etapa) => (
            <Cell key={etapa.numero} surface="paper" padding="lg" radius="md" span={3}>
              <span
                aria-hidden="true"
                className="font-display text-on-surface-muted block text-4xl font-semibold tabular-nums"
              >
                {etapa.numero}
              </span>
              <h3 className="font-display text-on-surface-display mt-3 text-base font-semibold">
                {etapa.titulo}
              </h3>
              <p className="mt-2 text-sm text-pretty">
                <Numerais texto={etapa.texto} numeros={etapa.numeros} />
              </p>
            </Cell>
          ))}

          {[prova, experiencia].map((bloco) => (
            <Cell key={bloco.titulo} surface="paper" padding="lg" radius="md" span={3}>
              <h3 className="font-display text-on-surface-display text-base font-semibold">
                {bloco.titulo}
              </h3>
              <p className="mt-3 text-sm text-pretty">
                <Numerais texto={bloco.texto} numeros={bloco.numeros} />
              </p>
            </Cell>
          ))}

          <Cell surface="mist" padding="lg" radius="md" span="full">
            <BracketLabel className="text-on-surface-muted">
              {cronograma.titulo}
            </BracketLabel>

            <dl className="mt-5 grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
              {cronograma.marcos.map((marco) => (
                <div key={marco.evento}>
                  <dt className="text-on-surface-muted font-mono text-xs tabular-nums">
                    {marco.data}
                  </dt>
                  <dd className="mt-1 text-sm text-pretty">{marco.evento}</dd>
                </div>
              ))}
            </dl>
          </Cell>
        </CellGrid>
      </div>
    </section>
  );
}
