import { Fragment } from 'react';

/**
 * Texto de parágrafo com os trechos numéricos declarados à parte. Declarar em
 * vez de detectar por expressão regular mantém a decisão no conteúdo: o que
 * conta como número é escolha de quem escreve, e um "16h" que precisa pesar não
 * fica igual a um "2025" que é só data.
 *
 * **Cada item de `numeros` tem de aparecer literalmente em `texto`.** O que não
 * aparecer é ignorado em silêncio: não quebra o build, não some da página, o
 * trecho apenas deixa de ficar em destaque. É o erro fácil de cometer ao
 * reescrever a frase e esquecer o array, então edite os dois juntos.
 */
export interface TextoComNumeros {
  readonly texto: string;
  readonly numeros: readonly string[];
}

interface Parte {
  readonly valor: string;
  readonly numero: boolean;
}

/**
 * Varredura literal, sem expressão regular: número de conteúdo carrega ponto,
 * vírgula, parêntese e porcentagem, e cada um pediria escape. A cada passo pega
 * a ocorrência mais à esquerda entre os candidatos, então a ordem do array não
 * importa. Trecho que se repete no texto é destacado só na primeira aparição.
 */
function partir(texto: string, numeros: readonly string[]): readonly Parte[] {
  const partes: Parte[] = [];
  let resto = texto;

  while (resto.length > 0) {
    let posicao = -1;
    let achado = '';

    for (const numero of numeros) {
      const encontrado = resto.indexOf(numero);
      if (encontrado !== -1 && (posicao === -1 || encontrado < posicao)) {
        posicao = encontrado;
        achado = numero;
      }
    }

    if (posicao === -1) {
      partes.push({ valor: resto, numero: false });
      break;
    }

    if (posicao > 0) partes.push({ valor: resto.slice(0, posicao), numero: false });
    partes.push({ valor: achado, numero: true });
    resto = resto.slice(posicao + achado.length);
  }

  return partes;
}

/**
 * Envolve em `data-numeral` os trechos numéricos: Inter Tight 600 com
 * tabular-nums, que é a regra de número dentro de parágrafo. Sora fica
 * reservada ao número que é elemento de display autônomo, fora de linha de
 * texto. O estilo mora no seletor `[data-numeral]`, em `app/globals.css`.
 */
export function Numerais({ texto, numeros }: Readonly<TextoComNumeros>) {
  if (numeros.length === 0) return texto;

  return partir(texto, numeros).map((parte, indice) =>
    parte.numero ? (
      <span key={`n-${indice}`} data-numeral>
        {parte.valor}
      </span>
    ) : (
      <Fragment key={`t-${indice}`}>{parte.valor}</Fragment>
    ),
  );
}
