import { ChevronDown } from 'lucide-react';

import { Cell } from '@/components/primitives/Cell';
import { CellGrid } from '@/components/primitives/CellGrid';
import { Numerais } from '@/components/primitives/Numerais';
import { SectionHeader } from '@/components/primitives/SectionHeader';
import { perguntas, secaoFaq } from '@/content/faq';

/**
 * `<details>` nativo, não componente de biblioteca. O Radix não renderiza
 * conteúdo fechado nem no servidor: as respostas sumiam do HTML e existiam só
 * no payload do runtime, o que num export estático é defeito de conteúdo antes
 * de ser de performance. Com `<details>` elas estão sempre no documento, o
 * teclado é nativo, o atributo `name` dá exclusividade mútua sem uma linha de
 * script, e a altura anima em CSS puro.
 *
 * Célula única em `paper`, sem mosaico, e é exceção deliberada à regra de
 * célula escura em seção clara: sem célula vizinha não há fresta para a costura
 * ler. O accordion também é o elemento interativo mais denso da página - sobre
 * `deep`, o anel de foco pulsaria contra o navy a cada tabulação.
 */
export function FAQ() {
  return (
    <section
      id="faq"
      data-surface="paper"
      aria-labelledby="faq-titulo"
      className="bg-lina-paper px-6 py-24 md:py-32"
    >
      <div className="mx-auto w-full max-w-6xl">
        <SectionHeader
          id="faq-titulo"
          label={secaoFaq.eyebrow}
          title={secaoFaq.titulo}
          className="max-w-3xl"
        />

        {/* Grid de uma coluna só para a célula entrar na cascata de revelação
            como qualquer outra - o FAQ não tem mosaico, mas tem entrada. */}
        <CellGrid columns={1} className="mt-12">
          <Cell surface="paper" padding="lg" radius="lg" className="border">
            <ul className="flex flex-col">
              {perguntas.map((item) => (
                <li key={item.id} className="border-t-border border-t first:border-t-0">
                  {/* `name` compartilhado: abrir uma fecha as outras, nativamente. */}
                  <details name="faq" className="group">
                    <summary className="font-display text-on-surface-display flex items-center justify-between gap-4 rounded-md py-5 text-base font-semibold md:text-lg">
                      {item.pergunta}
                      <ChevronDown
                        aria-hidden="true"
                        className="text-on-surface-muted size-5 shrink-0 transition-transform duration-200 group-open:rotate-180"
                      />
                    </summary>
                    <div data-details-corpo className="pb-5">
                      <p className="max-w-3xl text-sm text-pretty md:text-base">
                        <Numerais texto={item.texto} numeros={item.numeros} />
                      </p>
                    </div>
                  </details>
                </li>
              ))}
            </ul>
          </Cell>
        </CellGrid>
      </div>
    </section>
  );
}
