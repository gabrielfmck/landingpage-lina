// Atividades da Liga, incluindo as visitas técnicas - que são formato, e por
// isso vivem aqui e não em `Pilares`. "Participação em palestras, cursos,
// minicursos e oficinas" foi absorvida pelo item de oficinas e bootcamps, que é
// a versão específica da mesma coisa.
//
// O agrupamento é por modo de engajamento: o que o membro faz com o tempo dele.
// Agrupar por eixo repetiria a estrutura de `Pilares` logo acima, e vários
// itens atravessam mais de um eixo.

export interface Atividade {
  readonly titulo: string;
  readonly texto: string;
}

export interface GrupoAtuacao {
  readonly id: string;
  readonly nome: string;
  readonly itens: readonly Atividade[];
}

export const secaoAtuacao = {
  eyebrow: 'Como a Liga atua',
  titulo: 'Como isso acontece na prática.',
} as const;

export const gruposAtuacao: readonly GrupoAtuacao[] = [
  {
    id: 'construir',
    nome: 'Construir e competir',
    itens: [
      {
        titulo: 'Competições tecnológicas',
        texto:
          'Hackathons, maratonas de programação, olimpíadas científicas, competições de machine learning como o Kaggle, torneios de robótica e desafios de inovação.',
      },
      {
        titulo: 'Editais internos',
        texto: 'Seleção de projetos por edital interno.',
      },
    ],
  },
  {
    id: 'estudar',
    nome: 'Estudar junto',
    itens: [
      {
        titulo: 'Grupos temáticos de estudo',
        texto: 'Discussão presencial e virtual.',
      },
      {
        titulo: 'Trilhas guiadas',
        texto:
          'Percursos de estudo com monitoria de membros experientes e peer-teaching.',
      },
      {
        titulo: 'Oficinas e bootcamps',
        texto:
          'Matemática, probabilidade e estatística, algoritmos, programação, aprendizado de máquina e robótica. Também minicursos, palestras e cursos.',
      },
    ],
  },
  {
    id: 'ler',
    nome: 'Ler e questionar',
    itens: [
      {
        titulo: 'Leitura crítica',
        texto: 'Debate mensal de artigos de ponta.',
      },
      {
        titulo: 'Formação ética permanente',
        texto:
          'Minicursos, mesas-redondas e grupos de estudo sobre viés algorítmico, responsabilidade, transparência, uso responsável de dados e inclusão digital.',
      },
    ],
  },
  {
    id: 'fora',
    nome: 'Fora da UFU',
    itens: [
      {
        titulo: 'Mobilidade acadêmica',
        texto: 'Nacional e internacional, recebendo e enviando membros.',
      },
      {
        titulo: 'Visitas técnicas',
        texto: 'Instituições, laboratórios e universidades de excelência.',
      },
    ],
  },
];
