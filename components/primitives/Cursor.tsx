'use client';

import { useEffect } from 'react';

/**
 * Cursor de duas peças que **persegue** o ponteiro em vez de estar sempre nele.
 * O ponto vai atrás do cursor real com atraso curto; o anel vai atrás do ponto
 * com atraso mais longo. Nenhum dos dois crava: o gesto é o cursor alcançando
 * a mão do leitor, e é isso que o separa de um ponteiro redesenhado.
 *
 * O clique continua acontecendo onde o ponteiro real está, que em movimento é
 * um pouco à frente do desenho. É inerente a qualquer cursor com atraso, e o
 * tamanho do desvio é o que os fatores abaixo controlam.
 *
 * Sem biblioteca. O atraso é interpolação por quadro dentro de um `rAF` que só
 * roda enquanto o anel ainda tem distância a percorrer: parado o ponteiro, o
 * laço se encerra sozinho e a página volta a zero quadro por segundo. Posição
 * não é estado de dois valores, então não dá para transicionar em CSS - mas
 * tamanho e opacidade são, e esses ficam lá.
 *
 * Guardas, nesta ordem, e nenhuma é opcional:
 * - só existe em `pointer: fine`; em touch nada é criado e o nativo fica intacto;
 * - não existe sob `prefers-reduced-motion: reduce`;
 * - não substitui o anel de foco, que continua sendo os três anéis do teclado;
 * - onde o cursor nativo é `text`, ele se apaga e o I-beam volta.
 *
 * A cor vem de `--lina-surface-fg` lido no elemento sob o ponteiro - o mesmo
 * slot que Cell e Header usam. Branco fixo desapareceria em toda seção clara.
 * A posição é `translate`, nunca `top`/`left`, e os elementos são `fixed`,
 * então não participam de layout e não podem gerar deslocamento.
 */

/**
 * Fração da distância que cada peça percorre por quadro. Menor é mais lento.
 *
 * O ponto em 0,22 fecha 90% da distância em ~150ms; o anel em 0,12 leva ~290ms
 * e por isso arrasta atrás do ponto. Em movimento sustentado o anel encosta no
 * limite de contenção e é rebocado; a diferença entre os dois fatores aparece
 * na parada, quando o ponto assenta primeiro e o anel fecha o resto.
 */
const ATRASO_PONTO = 0.22;
const ATRASO_ANEL = 0.12;

/** Abaixo disto o anel chegou, e o laço para em vez de gastar quadro. */
const PARADO = 0.1;

/**
 * Distância máxima entre os dois centros, em px - é o que mantém o ponto sempre
 * dentro do anel.
 *
 * O valor é o **pior caso**, não o de cada estado. A folga entre o disco e a
 * borda interna do anel é 12,5px em repouso e 6,5px no hover, onde o ponto
 * cresce muito mais que o anel; como as duas peças escalam juntas, todo estado
 * intermediário fica entre esses dois. Um limite de 6 cabe em todos, inclusive
 * no meio da transição.
 *
 * Um limite por estado não funciona, e já foi tentado: o limite muda num
 * quadro e o tamanho leva 200ms para transicionar, então na saída de um link o
 * disco ainda grande escapa cerca de 4,4px para fora do anel. Segurar o limite
 * apertado com temporizador também não fecha o buraco. Uma constante que vale
 * em todo estado não tem esse problema, e o preço é o atraso do anel ficar mais
 * curto em repouso, que é onde ele menos aparece.
 *
 * Mexeu nos `scale` do cursor em `app/globals.css`? Refaça esta conta.
 */
const RAIO_MAX = 6;

export function Cursor() {
  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)');
    const semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!finePointer.matches || semMovimento.matches) return;

    const raiz = document.documentElement;

    const criar = (parte: 'ponto' | 'anel') => {
      const el = document.createElement('div');
      el.dataset.cursorParte = parte;
      el.dataset.cursor = 'repouso';
      el.setAttribute('aria-hidden', 'true');
      document.body.append(el);
      return el;
    };

    const ponto = criar('ponto');
    const anel = criar('anel');
    const pecas = [ponto, anel];
    raiz.dataset.cursorAtivo = '';

    // Alvo é o ponteiro real; as outras duas são as posições desenhadas.
    let alvoX = 0;
    let alvoY = 0;
    let pontoX = 0;
    let pontoY = 0;
    let anelX = 0;
    let anelY = 0;
    let primeiroMovimento = true;
    let quadro = 0;

    const posicionar = (el: HTMLElement, x: number, y: number) => {
      el.style.translate = `calc(${x}px - 50%) calc(${y}px - 50%)`;
    };

    const laco = () => {
      pontoX += (alvoX - pontoX) * ATRASO_PONTO;
      pontoY += (alvoY - pontoY) * ATRASO_PONTO;

      // O anel persegue o ponto, e não o ponteiro: é o que mantém as duas
      // peças como um conjunto em vez de dois objetos indo para o mesmo lugar.
      anelX += (pontoX - anelX) * ATRASO_ANEL;
      anelY += (pontoY - anelY) * ATRASO_ANEL;

      // Trava de contenção: o anel nunca fica mais longe que RAIO_MAX do ponto.
      const dx = pontoX - anelX;
      const dy = pontoY - anelY;
      const distancia = Math.hypot(dx, dy);
      if (distancia > RAIO_MAX) {
        const excesso = distancia - RAIO_MAX;
        anelX += (dx / distancia) * excesso;
        anelY += (dy / distancia) * excesso;
      }

      posicionar(ponto, pontoX, pontoY);
      posicionar(anel, anelX, anelY);

      const faltou =
        Math.abs(alvoX - pontoX) > PARADO ||
        Math.abs(alvoY - pontoY) > PARADO ||
        Math.abs(pontoX - anelX) > PARADO ||
        Math.abs(pontoY - anelY) > PARADO;
      quadro = faltou ? requestAnimationFrame(laco) : 0;
    };

    const mover = (evento: PointerEvent) => {
      alvoX = evento.clientX;
      alvoY = evento.clientY;

      // Sem isto as duas peças entrariam voando do canto superior esquerdo na
      // primeira vez que o ponteiro toca a página.
      if (primeiroMovimento) {
        primeiroMovimento = false;
        pontoX = alvoX;
        pontoY = alvoY;
        anelX = alvoX;
        anelY = alvoY;
      }

      if (quadro === 0) quadro = requestAnimationFrame(laco);
    };

    const INTERATIVO =
      'a[href], button, summary, [role="button"], input, textarea, select';

    const estado = (valor: string) => {
      for (const peca of pecas) peca.dataset.cursor = valor;

      // O disco muda de tamanho aqui; um quadro reposiciona o anel em volta
      // dele antes que a diferença apareça.
      if (quadro === 0) quadro = requestAnimationFrame(laco);
    };

    const entrar = (evento: PointerEvent) => {
      const alvo = evento.target;
      if (!(alvo instanceof Element)) return;

      const estilo = getComputedStyle(alvo);

      // Onde o nativo é I-beam - campo de texto e seleção - o custom some.
      if (estilo.cursor === 'text') {
        estado('oculto');
        return;
      }

      const cor = estilo.getPropertyValue('--lina-surface-fg').trim();
      if (cor) for (const peca of pecas) peca.style.color = cor;

      estado(alvo.closest(INTERATIVO) ? 'interativo' : 'repouso');
    };

    const pressionar = () => {
      for (const peca of pecas) peca.dataset.pressionado = '';
    };
    const soltar = () => {
      for (const peca of pecas) delete peca.dataset.pressionado;
    };
    const sair = () => estado('oculto');
    const voltar = () => estado('repouso');

    window.addEventListener('pointermove', mover, { passive: true });
    document.addEventListener('pointerover', entrar, { passive: true });
    window.addEventListener('pointerdown', pressionar, { passive: true });
    window.addEventListener('pointerup', soltar, { passive: true });
    document.addEventListener('pointerleave', sair);
    document.addEventListener('pointerenter', voltar);

    return () => {
      cancelAnimationFrame(quadro);
      window.removeEventListener('pointermove', mover);
      document.removeEventListener('pointerover', entrar);
      window.removeEventListener('pointerdown', pressionar);
      window.removeEventListener('pointerup', soltar);
      document.removeEventListener('pointerleave', sair);
      document.removeEventListener('pointerenter', voltar);
      for (const peca of pecas) peca.remove();
      delete raiz.dataset.cursorAtivo;
    };
  }, []);

  return null;
}
