import { BracketLabel } from '@/components/primitives/BracketLabel';
import { BrandAsset } from '@/components/primitives/BrandAsset';
import { Cell } from '@/components/primitives/Cell';
import { CellGrid } from '@/components/primitives/CellGrid';
import { Numerais } from '@/components/primitives/Numerais';
import { Button } from '@/components/ui/button';
import { divisoesResumo, hero } from '@/content/hero';
import { inscricoesAbertas } from '@/content/processo-seletivo';

/**
 * O hero é o mosaico: a seção é a superfície escura, e as células ficam sobre
 * ela separadas pela costura, que é onde o navy aparece. O motivo da marca é
 * estabelecido antes de qualquer texto ser lido - por isso ele é a composição,
 * e não um ornamento aplicado a ela.
 *
 * A coreografia de entrada é CSS puro, escrita em `app/globals.css`. Aqui só
 * ficam os papéis - qual célula é a líder, qual é a marca, quais são as
 * divisões - porque a ordem do texto dentro da célula-líder já é a ordem do
 * DOM e o escalonamento sai dela. Nenhum JavaScript participa: o conteúdo
 * acima da dobra nunca depende de um script para aparecer.
 */
export function Hero() {
  return (
    <section
      id="hero"
      data-surface="deep"
      aria-labelledby="hero-titulo"
      className="bg-lina-deep flex min-h-svh flex-col justify-center px-6 pt-28 pb-16"
    >
      <div className="mx-auto w-full max-w-6xl">
        <CellGrid columns={6} revelar={false}>
          <Cell
            surface="paper"
            padding="lg"
            radius="lg"
            span={4}
            data-hero-celula="lider"
          >
            <BracketLabel className="text-on-surface-muted">{hero.eyebrow}</BracketLabel>

            <h1
              id="hero-titulo"
              className="font-display text-on-surface-display mt-6 text-4xl font-semibold text-balance md:text-5xl lg:text-6xl"
            >
              {hero.titulo}
            </h1>

            <p className="text-on-surface-muted mt-6 max-w-prose text-base md:text-lg">
              {hero.sublinha}
            </p>

            {/* O prazo do ciclo na primeira tela. Some sozinho quando
                `inscricoesAbertas` vira false: anunciar inscrição encerrada
                acima da dobra seria pior do que não anunciar nada. Sem cor
                nova e sem selo - o peso vem de ser a única linha em negrito na
                cor de display, entre dois parágrafos que não são. */}
            {inscricoesAbertas ? (
              <p className="text-on-surface-display mt-6 text-base font-semibold text-balance md:text-lg">
                <Numerais
                  texto={hero.statusProcesso.texto}
                  numeros={hero.statusProcesso.numeros}
                />
              </p>
            ) : null}

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button asChild size="lg">
                <a href={hero.ctaPrimario.href}>{hero.ctaPrimario.rotulo}</a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href={hero.ctaSecundario.href}>{hero.ctaSecundario.rotulo}</a>
              </Button>
            </div>
          </Cell>

          {/* Coluna direita: a marca em cima, as três divisões embaixo. A célula
              da marca cresce para o mosaico fechar como retângulo - no logo os
              blocos preenchem a forma, a costura é que os separa. */}
          <div className="gap-seam flex flex-col md:col-span-2">
            <Cell
              surface="paper"
              padding="lg"
              radius="lg"
              data-hero-celula="marca"
              className="flex flex-1 items-center justify-center"
            >
              {/* A marca definitiva, sobre célula `paper` - por isso a
                  aplicação positiva. O cérebro é o motivo da página em
                  miniatura: blocos de canto arredondado separados por costura,
                  a mesma coisa que o mosaico ao redor faz em escala grande. */}
              <BrandAsset
                variant={hero.marca}
                loading="eager"
                className="w-full max-w-52"
              />
            </Cell>

            <CellGrid columns={3} revelar={false}>
              {divisoesResumo.map((divisao) => (
                <Cell
                  key={divisao.sigla}
                  surface={divisao.surface}
                  padding="sm"
                  radius="md"
                  data-hero-celula="divisao"
                >
                  <BracketLabel className="text-on-surface">{divisao.sigla}</BracketLabel>
                  <p className="mt-2 text-sm font-medium">{divisao.nomeCurto}</p>
                  {divisao.escopo ? (
                    <p className="mt-1 text-sm">{divisao.escopo}</p>
                  ) : null}
                </Cell>
              ))}
            </CellGrid>
          </div>
        </CellGrid>
      </div>
    </section>
  );
}
