import type { TextoComNumeros } from '@/components/primitives/Numerais';

// A estrutura vem do Regimento Art. 7º - Tutores, Coordenadores pedagógicos,
// Diretoria e as categorias de membro - e as demais diretorias são instituídas
// pelo Estatuto ao amparo do Art. 14 § 6º, que autoriza expressamente. As duas
// camadas são apresentadas no presente, sem ressalva.
//
// Cargos não aparecem, mesmo com a diretoria já composta. A seção também não
// anuncia essa ausência: "Membros" nomeia o que a lista é, e não a versão
// incompleta de uma lista de cargos. O campo `cargo` segue no tipo porque a
// decisão é do ciclo, não do desenho - atribuídos os cargos, basta preencher.
//
// A lista é de membros ativos, e não a dos fundadores do Art. 1º da minuta: a
// composição mudou e o rótulo acompanhou.

export interface OrgaoLiga {
  readonly nome: string;
  readonly composicao: string;
}

export interface Pessoa {
  readonly nome: string;
  /** Depende da ata da eleição. Ausente, não renderiza. */
  readonly cargo?: string;
  /**
   * Ausente por decisão: a célula é tipográfica e não reserva espaço de imagem,
   * porque catorze formas vazias em fileira seriam um avatar quebrado. A
   * chegada de fotos pede revisão de layout da célula, não só preenchimento do
   * campo.
   */
  readonly foto?: string;
}

export interface GrupoDePessoas {
  readonly id: string;
  readonly rotulo: string;
  readonly pessoas: readonly Pessoa[];
}

export const secaoEquipe = {
  eyebrow: 'Quem faz',
  titulo: 'Quem faz e como se organiza.',

  estrutura: {
    titulo: 'Como a Liga se organiza',
    orgaos: [
      {
        nome: 'Docentes',
        composicao:
          'Tutor e coordenadores pedagógicos, docentes do quadro permanente da FACOM-UFU.',
      },
      { nome: 'Presidência', composicao: 'Presidente e Vice-Presidente.' },
      {
        nome: 'Diretorias',
        composicao:
          'Secretaria, Comunicação e Presença Digital, Recursos Humanos e Tesouraria.',
      },
      {
        nome: 'Coordenações',
        composicao: 'Projeto, Pesquisa, Ensino e Extensão.',
      },
    ] satisfies readonly OrgaoLiga[],
  },

  // Regimento Art. 48, 49 VI e Estatuto Art. 27 III. Responde a uma pergunta
  // que o candidato não sabe que tem: onde ele pode chegar.
  eleicao: {
    titulo: 'Eleição todo ano',
    texto:
      'A diretoria é eleita a cada ano e cumpre mandato de 1 ano, com até duas reeleições. Todo membro efetivo pode se candidatar a um cargo.',
    numeros: ['1 ano'],
  } satisfies TextoComNumeros & { titulo: string },
} as const;

/**
 * Tipado explicitamente em vez de `as const`: a anotação preserva `cargo?` e
 * `foto?` como opcionais para o componente degradar pelo tipo.
 *
 * Os orientadores externos são grupo próprio porque não são nenhuma das duas
 * coisas que os outros dois grupos nomeiam: não são docentes da FACOM nem
 * discentes membros. O Regimento Art. 7º já prevê a categoria de colaborador
 * externo; o rótulo usa o termo corrente na Liga.
 *
 * Ordem dentro de "Membros": quem já estava, depois quem entrou. Sem cargo
 * publicado, qualquer outra ordenação afirmaria uma hierarquia que a página
 * não tem fonte para afirmar.
 */
export const gruposEquipe: readonly GrupoDePessoas[] = [
  {
    id: 'orientadores',
    // Termo do Edital 01/2026, item 3.10. O Regimento diz "coordenadores
    // pedagógicos"; os dois nomeiam o mesmo papel, e o edital é a fonte mais
    // recente e publicada.
    rotulo: 'Professores orientadores',
    pessoas: [
      { nome: 'Prof. Alexsandro Santos Soares' },
      { nome: 'Prof. Daniel Duarte Abdala' },
      { nome: 'Prof. Igor Natal' },
      { nome: 'Prof. Leonardo Muttoni' },
    ],
  },
  {
    id: 'orientadores-externos',
    // Os dois também são docentes, e aqui o "Prof." carrega informação que o
    // rótulo do grupo não dá.
    rotulo: 'Orientadores externos',
    pessoas: [{ nome: 'Prof. Jair Rocha' }, { nome: 'Prof. Edmar Isaias' }],
  },
  {
    id: 'membros',
    rotulo: 'Membros',
    pessoas: [
      { nome: 'Gabriel Fernandes' },
      { nome: 'Leonardo Cardoso' },
      { nome: 'Bruno Ferrari' },
      { nome: 'Marya Ysabella' },
      { nome: 'Rafael Lemos' },
      { nome: 'Davi Faria' },
      { nome: 'Victor Brizante' },
      { nome: 'André Polimanti' },
    ],
  },
];
