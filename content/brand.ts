// Manifesto dos assets de marca. Nenhum componente referencia arquivo de imagem
// direto: `<BrandAsset variant="..." />` resolve caminho, proporção e alt a
// partir daqui.
//
// Os arquivos são os definitivos, exportados da identidade em SVG. As
// dimensões são o viewBox de cada arquivo, arredondado - é delas que sai o
// `aspect-ratio` que reserva a caixa e mantém o CLS em zero.
//
// **Negativo não é tema.** A página não tem dark mode; o que existe são
// superfícies. Toda marca aplicada sobre `deep` ou `royal` usa a variante
// `-negativo`, e quem decide é o componente que conhece a própria superfície -
// o Header, que já mapeia a seção de baixo para uma das suas duas. O sinal é a
// superfície da **célula**, não a da seção: o rodapé é claro e a célula da
// marca dentro dele é escura.
//
// **A reduzida é a aplicação pequena.** A completa traz a linha "Liga de
// Robótica e IA · < FACOM - UFU" dentro do mesmo viewBox; a reduzida é só
// cérebro e wordmark, então o desenho ocupa mais caixa. Header e menu usam a
// reduzida porque a 144px aquela linha mede 4px e vira ruído.
//
// **Defeito conhecido em `ia`, `r` e `ml`:** os três saíram do editor com a
// linha de descrição como `<text>` vivo na fonte Vinila Variable, que o
// visitante não tem instalada - o navegador cai para uma fonte qualquer. Os
// lockups principais vieram com o texto em contorno e não têm o problema. O
// conserto é reexportar os três com o texto convertido em contorno; não dá para
// corrigir daqui.

export type BrandVariant =
  | 'mark'
  | 'mark-negativo'
  | 'lockup-horizontal'
  | 'lockup-horizontal-negativo'
  | 'lockup-horizontal-reduzido'
  | 'lockup-horizontal-reduzido-negativo'
  | 'lockup-vertical'
  | 'lockup-vertical-negativo'
  | 'ia'
  | 'r'
  | 'ml';

export interface BrandAssetSpec {
  /** Caminho a partir de `public/`. */
  readonly src: string;
  /** Largura intrínseca reservada, em px. */
  readonly width: number;
  /** Altura intrínseca reservada, em px. */
  readonly height: number;
  /** Alt descritivo. String vazia marca uso decorativo. */
  readonly alt: string;
}

// O alt do negativo é o do positivo: é a mesma marca em outra aplicação, e
// quem lê com leitor de tela não precisa saber a cor da superfície.
const ALT_LOCKUP = 'LINA - Liga de Robótica e IA, FACOM UFU';
const ALT_MARCA = 'Símbolo da LINA';

export const brandAssets: Record<BrandVariant, BrandAssetSpec> = {
  mark: {
    src: '/brand/mark.svg',
    width: 239,
    height: 198,
    alt: ALT_MARCA,
  },
  'mark-negativo': {
    src: '/brand/mark-negativo.svg',
    width: 239,
    height: 198,
    alt: ALT_MARCA,
  },
  'lockup-horizontal': {
    src: '/brand/lockup-horizontal.svg',
    width: 662,
    height: 198,
    alt: ALT_LOCKUP,
  },
  'lockup-horizontal-negativo': {
    src: '/brand/lockup-horizontal-negativo.svg',
    width: 662,
    height: 198,
    alt: ALT_LOCKUP,
  },
  // Versão reduzida: cérebro e wordmark, sem a linha de descrição. Mesmo
  // viewBox da completa, então o desenho ocupa mais caixa - é o que a torna
  // legível onde a completa entrega uma descrição de 4px, que é ruído e não
  // informação. É a aplicação de barra e de menu.
  'lockup-horizontal-reduzido': {
    src: '/brand/lockup-horizontal-reduzido.svg',
    width: 662,
    height: 198,
    alt: ALT_LOCKUP,
  },
  'lockup-horizontal-reduzido-negativo': {
    src: '/brand/lockup-horizontal-reduzido-negativo.svg',
    width: 662,
    height: 198,
    alt: ALT_LOCKUP,
  },
  'lockup-vertical': {
    src: '/brand/lockup-vertical.svg',
    width: 383,
    height: 397,
    alt: ALT_LOCKUP,
  },
  'lockup-vertical-negativo': {
    src: '/brand/lockup-vertical-negativo.svg',
    width: 647,
    height: 670,
    alt: ALT_LOCKUP,
  },
  // As três divisões têm larguras diferentes entre si porque o nome de cada uma
  // tem comprimento diferente. É o arquivo real, não um descuido: a altura é a
  // mesma nas três, então lado a lado elas alinham pela linha de base.
  ia: {
    src: '/brand/ia.svg',
    width: 913,
    height: 198,
    alt: 'LINA-IA - Divisão de Inteligência Artificial',
  },
  r: {
    src: '/brand/r.svg',
    width: 869,
    height: 198,
    alt: 'LINA-R - Divisão de Robótica',
  },
  ml: {
    src: '/brand/ml.svg',
    width: 1019,
    height: 198,
    alt: 'LINA-ML - Divisão de Machine Learning',
  },
};
