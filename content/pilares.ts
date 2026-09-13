// Fronteira com `Atuacao`: Pilares carrega compromisso e obrigação, Atuacao
// carrega formato. Por esse critério, "participação em palestras, cursos,
// minicursos e oficinas" e "visitas técnicas" vivem lá, e não aqui. Nenhuma
// frase se repete entre as duas seções.

/** A parte numérica recebe `data-numeral`: Inter Tight 600 com tabular-nums. */
export interface Exigencia {
  /** Ausente quando a obrigação não tem quantidade - Pesquisa é o caso. */
  readonly numero?: string;
  readonly resto?: string;
}

export interface Pilar {
  readonly id: string;
  readonly nome: string;
  readonly texto: string;
  readonly exigencia: Exigencia;
}

export const pilares = {
  eyebrow: 'Os três pilares',
  titulo: 'Ensino, pesquisa e extensão não se separam.',

  // O rótulo transfere o peso para a norma: a cobrança recai sobre a Liga.
  rotuloExigencia: 'O regimento exige:',

  espinha: {
    paragrafo:
      'A Liga se sustenta na indissociabilidade entre ensino, pesquisa e extensão. Não são três frentes que convivem: é um compromisso só, e o regimento cobra os três.',
    simposio: {
      antes:
        'Além do que cada eixo exige, a Liga organiza um simpósio, jornada ou encontro acadêmico',
      numero: 'a cada 2 anos',
    },
  },
} as const;

/**
 * Anotação explícita em vez de `as const`: o literal apagaria `numero?` e
 * `resto?`, e é por eles que Pesquisa degrada sem condicional no JSX.
 */
export const eixosPilares: readonly Pilar[] = [
  {
    id: 'ensino',
    nome: 'Ensino',
    texto:
      'Congregar discentes e docentes interessados em IA e Robótica, estudar a fundo a bibliografia definida por tutores e coordenadores, e desenvolver projetos propostos por docentes, pelos próprios membros ou por instituições parceiras.',
    exigencia: { numero: '40 horas semestrais', resto: 'em reuniões semanais' },
  },
  {
    id: 'pesquisa',
    nome: 'Pesquisa',
    texto:
      'Produzir pesquisa e estudo técnico-científico, ler e discutir as publicações correntes para trazer o estado da arte para dentro da FACOM, e divulgar o conhecimento produzido.',
    exigencia: { resto: 'produção científica contínua' },
  },
  {
    id: 'extensao',
    nome: 'Extensão',
    texto:
      'Democratizar conhecimento dentro e fora da universidade; firmar parcerias com instituições públicas e privadas, ONGs e entidades filantrópicas, entregando software e soluções tecnológicas que melhorem a qualidade de vida das populações atendidas; e levar alfabetização tecnológica ao ensino básico.',
    exigencia: { numero: '60 horas anuais' },
  },
];
