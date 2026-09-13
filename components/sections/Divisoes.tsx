import { BracketLabel } from '@/components/primitives/BracketLabel';
import { BrandAsset } from '@/components/primitives/BrandAsset';
import { Cell } from '@/components/primitives/Cell';
import { CellGrid } from '@/components/primitives/CellGrid';
import { SectionHeader } from '@/components/primitives/SectionHeader';
import { divisoes, secaoDivisoes, type DivisaoSurface } from '@/content/divisoes';
import { cn } from '@/lib/utils';

// A variante `-text` é o par da cor viva para texto sobre superfície clara.
// A sigla, que fica sobre a cor viva, não usa isto: herda `ink` do data-surface,
// o único token que passa AA sobre as três.
const nomeClass: Record<DivisaoSurface, string> = {
  ia: 'text-lina-ia-text',
  r: 'text-lina-r-text',
  ml: 'text-lina-ml-text',
};

/**
 * A cor viva é a célula externa e a informação mora numa célula clara aninhada
 * dentro dela - a cor aparece como fresta em toda a volta, que é o motivo do
 * mosaico um nível abaixo. Não é um cartão colorido: é uma célula deixando a
 * superfície de baixo aparecer.
 *
 * Superfície `paper` porque fresta branca separa cor saturada com força máxima;
 * sobre `mist` as três cores caem de 2.22/2.92/3.51 para 2.01/2.64/3.17.
 *
 * Paridade é intencional. Diferente de `Pilares`, aqui não há tese contra
 * hierarquia - nenhuma divisão é maior que outra, e as três células são iguais.
 */
export function Divisoes() {
  return (
    <section
      id="divisoes"
      data-surface="paper"
      aria-labelledby="divisoes-titulo"
      className="bg-lina-paper px-6 py-24 md:py-32"
    >
      <div className="mx-auto w-full max-w-6xl">
        <SectionHeader
          id="divisoes-titulo"
          label={secaoDivisoes.eyebrow}
          title={secaoDivisoes.titulo}
          subtitle={secaoDivisoes.sublinha}
          className="max-w-3xl"
        />

        <CellGrid columns={3} className="mt-12">
          {divisoes.map((divisao) => (
            // Raio concêntrico: externa em radius lg (32px) com padding sm
            // (16px) pede interna de 16px, que é radius sm.
            <Cell key={divisao.sigla} surface={divisao.surface} padding="sm" radius="lg">
              <BracketLabel className="block px-2 pt-2 pb-4">
                {divisao.sigla}
              </BracketLabel>

              <Cell data-costura surface="paper" padding="md" radius="sm">
                {/* Preso pela altura, não pela largura. Os três lockups têm a
                    mesma altura de viewBox e larguras diferentes - o nome de
                    cada divisão tem comprimento diferente. Limitar a largura
                    faria o mais largo, LINA-ML, encolher e as três aparecerem
                    em escalas diferentes lado a lado. */}
                <BrandAsset variant={divisao.asset} className="h-10 w-auto" />
                <h3
                  className={cn(
                    'font-display mt-6 text-lg font-semibold text-balance',
                    nomeClass[divisao.surface],
                  )}
                >
                  {divisao.nome}
                </h3>
                {divisao.escopo ? <p className="mt-3 text-sm">{divisao.escopo}</p> : null}
              </Cell>
            </Cell>
          ))}
        </CellGrid>
      </div>
    </section>
  );
}
