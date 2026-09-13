import { BracketLabel } from '@/components/primitives/BracketLabel';
import { Cell } from '@/components/primitives/Cell';
import { CellGrid } from '@/components/primitives/CellGrid';
import { SectionHeader } from '@/components/primitives/SectionHeader';
import { sobre } from '@/content/sobre';

/**
 * Superfície clara, então o mosaico só existe porque a célula do vínculo é
 * escura: `mist` sobre `paper` contrasta 1.11 e a costura não leria sozinha.
 *
 * Ritmo 2+1 / 1+2 / 1+1+1 em três colunas - deliberadamente diferente do 4+2
 * em seis colunas do Hero, para o motivo da célula não virar maneirismo.
 */
export function Sobre() {
  return (
    <section
      id="sobre"
      data-surface="paper"
      aria-labelledby="sobre-titulo"
      className="bg-lina-paper px-6 py-24 md:py-32"
    >
      <div className="mx-auto w-full max-w-6xl">
        <SectionHeader
          id="sobre-titulo"
          label={sobre.eyebrow}
          title={sobre.titulo}
          className="max-w-3xl"
        />

        <CellGrid columns={3} className="mt-12">
          {/* Ordem do DOM: abertura, vínculo, natureza, objetivo. A célula escura
              é a segunda para que o motivo apareça cedo no mobile; `order`
              devolve o ziguezague 2+1 / 1+2 a partir de md. Nenhuma delas tem
              elemento focável, então a divergência é só visual. */}
          <Cell surface="mist" padding="lg" radius="lg" span={2} className="md:order-1">
            <p className="text-lg text-pretty md:text-xl">{sobre.abertura}</p>
          </Cell>

          <Cell surface="deep" padding="lg" radius="lg" span={2} className="md:order-4">
            <h3 className="font-display text-on-surface-display text-xl font-semibold md:text-2xl">
              {sobre.vinculo.titulo}
            </h3>
            {sobre.vinculo.paragrafos.map((paragrafo) => (
              <p key={paragrafo.slice(0, 32)} className="mt-4 text-sm md:text-base">
                {paragrafo}
              </p>
            ))}
            <p className="border-t-lina-mist/30 mt-6 border-t pt-4 text-sm md:text-base">
              {sobre.vinculo.remate.antes}{' '}
              <a
                href={sobre.vinculo.remate.href}
                className="rounded-md font-semibold underline underline-offset-4"
              >
                {sobre.vinculo.remate.rotulo}
              </a>
              .
            </p>
          </Cell>

          <Cell surface="mist" padding="lg" radius="lg" span={1} className="md:order-2">
            <BracketLabel className="text-on-surface-muted">Natureza</BracketLabel>
            <ul className="mt-4 flex flex-col gap-2 font-mono text-xs">
              {sobre.natureza.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Cell>

          <Cell surface="mist" padding="lg" radius="lg" span={1} className="md:order-3">
            <h3 className="font-display text-on-surface-display text-xl font-semibold">
              {sobre.objetivo.titulo}
            </h3>
            <p className="mt-4 text-sm">{sobre.objetivo.texto}</p>
            <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-2 font-mono text-xs">
              {sobre.objetivo.competencias.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Cell>

          {/* 1 + 1 + 1 */}
          {sobre.resultados.map((resultado) => (
            <Cell
              key={resultado.titulo}
              surface="mist"
              padding="lg"
              radius="md"
              span={1}
              className="md:order-5"
            >
              <BracketLabel className="text-on-surface-muted">
                {resultado.titulo}
              </BracketLabel>
              <p className="mt-3 text-sm">{resultado.texto}</p>
            </Cell>
          ))}
        </CellGrid>
      </div>
    </section>
  );
}
