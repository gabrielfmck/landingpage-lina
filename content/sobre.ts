// Natureza, objetivo e resultados esperados da Liga. A certificação vem da
// Resolução CONFACOM nº 24/2025, artigos 32, 38 e 41-43.

export interface ResultadoEsperado {
  readonly titulo: string;
  readonly texto: string;
}

export const sobre = {
  eyebrow: 'Sobre a Liga',
  titulo: 'Feita por estudantes da FACOM, dentro da estrutura da Faculdade.',

  abertura:
    'A LINA é uma associação científica criada e organizada por estudantes de graduação da FACOM-UFU, sob coordenação pedagógica de docentes da própria Faculdade. É livre, sem fins lucrativos, apartidária e sem vínculo religioso. E não tem prazo para acabar: a diretoria muda a cada ano, a Liga permanece.',

  // Atributos formais do estatuto, em mono - é metadado, não prosa.
  natureza: [
    'Associação científica livre',
    'Sem fins lucrativos',
    'Apartidária',
    'Sem vínculo religioso',
    'Duração ilimitada',
  ],

  objetivo: {
    titulo: 'O objetivo',
    texto:
      'Aprofundamento teórico e prático em Inteligência Artificial, Robótica e áreas correlatas: desenvolver sistemas inteligentes, dominar as ferramentas atuais e firmar as competências que sustentam as duas coisas.',
    competencias: ['Matemática', 'Estatística', 'Algoritmos', 'Programação', 'Inglês'],
  },

  // A mecânica da declaração vive em `ProcessoSeletivo`, onde é o argumento mais
  // forte da seção. Aqui fica so o ponto institucional -- que o vínculo é real e
  // produz documento -- com âncora para lá. O mesmo parágrafo em duas seções
  // faria a segunda ler como enchimento.
  vinculo: {
    titulo: 'O vínculo e o que ele produz',
    paragrafos: [
      'A Liga é vinculada ao Colegiado de Extensão da FACOM-UFU e só começou a operar depois de registrada como Programa de Extensão no SIEX. As atividades são extracurriculares e podem se relacionar com componentes curriculares regulares, para ampliar e complementar a formação - nunca para substituir disciplina.',
    ],
    remate: {
      antes:
        'É esse vínculo que faz a participação virar documento oficial - o que a declaração traz está',
      href: '#processo-seletivo',
      rotulo: 'no processo seletivo',
    },
  },

  resultados: [
    {
      titulo: 'Competência e critério',
      texto: 'Formação técnica ampliada, com senso crítico sobre o que se constrói.',
    },
    {
      titulo: 'Produção científica',
      texto: 'Artigos, protótipos e participação em congressos.',
    },
    {
      titulo: 'Extensão social',
      texto:
        'Integração acadêmica e democratização do conhecimento para fora da universidade.',
    },
  ] satisfies readonly ResultadoEsperado[],
} as const;
