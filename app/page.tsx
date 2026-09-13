import { Atuacao } from '@/components/sections/Atuacao';
import { Divisoes } from '@/components/sections/Divisoes';
import { Equipe } from '@/components/sections/Equipe';
import { FAQ } from '@/components/sections/FAQ';
import { Footer } from '@/components/sections/Footer';
import { Hero } from '@/components/sections/Hero';
import { Pilares } from '@/components/sections/Pilares';
import { ProcessoSeletivo } from '@/components/sections/ProcessoSeletivo';
import { Sobre } from '@/components/sections/Sobre';

/**
 * A composição da página, e nada além: nenhuma lógica, nenhum dado, nenhum
 * estado. A ordem daqui é a ordem de leitura do visitante.
 *
 * Seção nova entra em três lugares, e os três importam:
 *
 * 1. aqui, na posição de leitura;
 * 2. no próprio componente, que precisa de `id`, de `data-surface` e de
 *    `aria-labelledby` apontando para o id do título - o `id` é o alvo da
 *    âncora, e o `data-surface` é o que o header lê para escolher a cor dele;
 * 3. em `navItems`, de `content/navigation.ts`, se ela for navegável.
 *
 * `Footer` fica fora de `<main>` porque é conteúdo do site, não da página. O
 * `<span id="topo">` é o alvo do link da marca no header, e é `sr-only` por não
 * ter nada a mostrar: existe só para a âncora ter onde chegar.
 */
export default function Home() {
  return (
    <>
      <main id="conteudo">
        <span id="topo" className="sr-only" />

        <Hero />
        <Sobre />
        <Pilares />
        <Divisoes />
        <Atuacao />
        <ProcessoSeletivo />
        <Equipe />
        <FAQ />
      </main>

      <Footer />
    </>
  );
}
