import type { CellSurface } from '@/components/primitives/Cell';
import type { BrandVariant } from '@/content/brand';

// Fonte única das três divisões: o Hero também lê daqui, para nome e sigla não
// divergirem entre as duas seções.
//
// Divisão não tem campus. A Liga é uma só e opera nos dois campi da FACOM -
// não é uma frente de IA em Uberlândia e outra de Robótica em Monte Carmelo.
// O campo existiu e saiu: era mapa errado, não dado faltando.

export type DivisaoSurface = Extract<CellSurface, 'ia' | 'r' | 'ml'>;

export interface Divisao {
  readonly sigla: string;
  /** Nome completo da divisão. */
  readonly nome: string;
  /** Forma curta, para onde não cabe o nome completo. */
  readonly nomeCurto: string;
  readonly surface: DivisaoSurface;
  readonly asset: BrandVariant;
  /** Ainda não definido. Ausente, a frase de escopo não renderiza. */
  readonly escopo?: string;
}

export const divisoes: readonly Divisao[] = [
  {
    sigla: 'LINA-IA',
    nome: 'Divisão de Inteligência Artificial',
    nomeCurto: 'Inteligência Artificial',
    surface: 'ia',
    asset: 'ia',
  },
  {
    sigla: 'LINA-R',
    nome: 'Divisão de Robótica',
    nomeCurto: 'Robótica',
    surface: 'r',
    asset: 'r',
  },
  {
    sigla: 'LINA-ML',
    nome: 'Divisão de Machine Learning',
    nomeCurto: 'Machine Learning',
    surface: 'ml',
    asset: 'ml',
  },
];

export const secaoDivisoes = {
  eyebrow: 'As três divisões',
  titulo: 'Uma Liga, três divisões.',
  sublinha: 'Cada uma com nome, sigla e identidade visual própria.',
} as const;
