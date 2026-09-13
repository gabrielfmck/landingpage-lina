import type { TextoComNumeros } from '@/components/primitives/Numerais';

// As citações vêm do Regimento (Resolução CONFACOM 24/2025) e não do Estatuto,
// que ainda é minuta: onde os dois dizem a mesma coisa, vale a resolução
// publicada. O recorte de elegibilidade é o do Edital 01/2026, que rege o ciclo
// corrente - o Regimento Art. 7º § 2º admite discentes de outras unidades da
// UFU, mas este edital não abriu para eles e a página não convida quem ele não
// aceita.
//
// Vagas, datas e link de inscrição vêm do Edital 01/2026. Quatro coisas dele
// ficaram deliberadamente de fora, e cada uma tem motivo:
//
// - A tabela de pontuação. O item 3.6 soma 100 pontos sem a prova; o 5.3
//   acrescenta 30 pontos de prova classificatória. Não fecha, e número que não
//   fecha em regra de seleção é pior que número ausente.
// - O prazo "até 30/10/2026" para resultado de recursos, que no cronograma vem
//   depois do início das atividades em 01/10. É quase certamente 30/09.
// - O link do PDF do edital, que chama a Liga de "Sinapse" em três itens.
// - O pré-requisito de 6 meses do item 2.2, que afrouxa o mínimo de 1 ano do
//   Regimento Art. 25 e faria o candidato entrar achando que certifica em um
//   semestre. A certificação exige o ano completo.
//
// Onde o edital restringe, ele vence: a disponibilidade semanal subiu de 12h
// (Estatuto, Art. 12 III) para 16h.

export interface Requisito extends TextoComNumeros {
  readonly titulo: string;
}

export interface Etapa extends TextoComNumeros {
  /** Número de display autônomo - este é o caso em que Sora é permitida. */
  readonly numero: string;
  readonly titulo: string;
}

/** A data é legenda de dado, e por isso vai em mono com tabular-nums. */
export interface MarcoDoCronograma {
  readonly data: string;
  readonly evento: string;
}

/** Artigo separado do termo para a frase concordar ao ser montada. */
export interface ItemDeclaracao {
  readonly artigo: string;
  readonly termo: string;
}

/**
 * A única chave que a próxima gestão precisa virar quando o ciclo fecha.
 * Tipada como `boolean` e não inferida como `true` de propósito: dentro de um
 * `as const` o literal apagaria o outro ramo, e o estado de ciclo encerrado
 * deixaria de existir para o TypeScript.
 *
 * Passada a data de encerramento, trocar para `false` e rebuildar - o botão
 * some e a célula passa a declarar o ciclo fechado. Não há cálculo de "hoje"
 * em runtime: o build é estático e a degradação é por dado.
 */
export const inscricoesAbertas: boolean = true;

/**
 * A data-limite do ciclo, num lugar só. O hero também a anuncia, e duas datas
 * digitadas em dois arquivos é como um site termina com dois prazos diferentes.
 */
export const encerramentoDasInscricoes = '18 de setembro';

const encerramentoComAno = `${encerramentoDasInscricoes} de 2026`;

export const processoSeletivo = {
  eyebrow: 'Processo seletivo',
  titulo: 'Como entrar na LINA.',

  requisitos: [
    {
      titulo: 'Quem pode entrar',
      texto: 'Estudantes com matrícula regular em curso de graduação da FACOM-UFU.',
      numeros: [],
    },
    {
      titulo: '16 horas por semana',
      texto:
        'Disponibilidade mínima, respeitando os horários dos componentes curriculares obrigatórios.',
      numeros: [],
    },
    {
      titulo: 'De 1 a 3 anos',
      texto:
        'A expectativa é de permanência mínima de um ano. O máximo como membro discente efetivo é três.',
      numeros: [],
    },
  ] satisfies readonly Requisito[],

  // São duas exigências de presença, não uma: Art. 26, I pede 100% nas
  // Assembleias e reuniões deliberativas, e o Art. 26, II com o Art. 41 pedem
  // 75% nas demais. Quem lê esta célula está calculando se consegue.
  permanencia: {
    titulo: 'Para permanecer',
    texto:
      'Presença em 100% das Assembleias e reuniões deliberativas, e frequência mínima de 75% nas demais atividades, comprovada por lista de presença. Participação ativa em pelo menos 2 projetos por semestre letivo. Abaixo de 75%, o desligamento é automático.',
    numeros: ['100%', '75%', '2 projetos'],
  } satisfies Requisito,

  // Regimento Art. 41 e Estatuto Art. 50, 51 e 29 § 1º. É a resposta à pergunta
  // silenciosa de todo candidato, e transforma o piso de frequência de ameaça
  // em regra com saída.
  justificativa: {
    titulo: 'Se você não conseguir cumprir',
    texto:
      'Faltas podem ser justificadas por escrito, com documentação, em até 7 dias. Valem problemas de saúde, falecimento familiar, licença maternidade e paternidade e participação em evento científico; outros casos são avaliados pela Coordenação em Assembleia. Aceita a justificativa, a contagem de faltas só recomeça quando a razão impeditiva termina.',
    numeros: ['7 dias'],
  } satisfies Requisito,

  declaracao: {
    titulo: 'O que você leva ao final',
    paragrafo:
      'Quem cumpre o ano mínimo com a frequência exigida tem direito a declaração ou certificação, depois da análise da documentação anual pela Coordenação de Extensão. Ela é providenciada pela diretoria, assinada pelo Tutor e pelo Coordenador de Extensão, e emitida pelos sistemas institucionais.',
    constamAntes: 'Nela constam',
    consta: [
      { artigo: 'o', termo: 'cargo ocupado' },
      { artigo: 'a', termo: 'carga horária anual' },
      { artigo: 'as', termo: 'datas de início e término' },
    ] satisfies readonly ItemDeclaracao[],
    // Único benefício do item 7 do edital que não repete Pilares ou Atuação, e
    // por isso o único que entrou. Estava fora da página até aqui por falta de
    // fonte - o edital passou a ser a fonte.
    complementares: 'A participação também é aproveitada como horas complementares.',
    limite: 'Cada estudante pode ser certificado por apenas uma Liga por ano.',
  },

  // Quatro etapas, e não as duas do item 3.5: a seção 5 do mesmo edital
  // acrescenta prova classificatória e análise de currículo, e o cronograma
  // marca a prova em 21/09. Onde o edital se contradiz, vale o cronograma, que
  // é a única parte dele sem ambiguidade sobre o que acontece e quando.
  etapas: [
    {
      numero: '01',
      titulo: 'Inscrição',
      texto: 'Cadastro e submissão de dados pelo formulário online. Sem taxa.',
      numeros: [],
    },
    {
      numero: '02',
      titulo: 'Prova',
      texto:
        'Prova classificatória com questões objetivas sobre competências gerais e as específicas da área escolhida.',
      numeros: [],
    },
    {
      numero: '03',
      titulo: 'Entrevista',
      texto: 'Com membros atuais e/ou o coordenador.',
      numeros: [],
    },
    {
      numero: '04',
      titulo: 'Resultado',
      texto:
        'Classificação por ordem decrescente de desempenho. Quem fica fora das vagas pode compor lista de espera, com convocação em até 12 meses.',
      numeros: ['12 meses'],
    },
  ] satisfies readonly Etapa[],

  prova: {
    titulo: 'O que cai na prova',
    texto:
      'Para Robótica e IA: conceitos de circuitos, lógica de programação em C/C++ e Python, microcontroladores e eletrônica básica, noções de matemática para IA e raciocínio lógico. Para Marketing: branding, gestão de redes sociais, ferramentas de design e métricas de engajamento. A bibliografia sugerida sai depois do encerramento das inscrições.',
    numeros: [],
  } satisfies Requisito,

  experiencia: {
    titulo: 'Os primeiros meses',
    texto:
      'O período de experiência é de 3 meses, com avaliação de assiduidade, entrega de tarefas e proatividade, e feedback mensal da diretoria. Abaixo de 70% da pontuação, o desligamento acontece ao fim do período.',
    numeros: ['3 meses', '70%'],
  } satisfies Requisito,

  cronograma: {
    titulo: 'Cronograma de 2026',
    marcos: [
      { data: '11/09', evento: 'Abertura das inscrições' },
      { data: '18/09', evento: 'Encerramento das inscrições' },
      { data: '21/09', evento: 'Prova classificatória' },
      { data: '23/09', evento: 'Resultado da prova e agendamento das entrevistas' },
      { data: '24 e 25/09', evento: 'Entrevistas' },
      { data: '25/09', evento: 'Resultado final' },
      { data: 'até 29/09', evento: 'Prazo para recurso' },
      { data: '01/10', evento: 'Início das atividades' },
    ] satisfies readonly MarcoDoCronograma[],
  },

  // A célula da ação. Ela e o cronograma são as duas cujo conteúdo muda a cada
  // ciclo, e por isso as duas em `mist` - uma abre a seção, a outra fecha.
  inscricao: {
    titulo: 'Ciclo 2026-02',
    aberta: {
      texto: `As inscrições do Edital 01/2026 estão abertas e se encerram em ${encerramentoComAno}. A inscrição é gratuita e feita pelo formulário online.`,
      numeros: [encerramentoComAno],
    } satisfies TextoComNumeros,
    encerrada: {
      texto: `As inscrições do Edital 01/2026 se encerraram em ${encerramentoComAno}. O próximo processo acontece nas três primeiras semanas do semestre letivo.`,
      numeros: [encerramentoComAno],
    } satisfies TextoComNumeros,
    vagas: {
      texto: 'São pelo menos 20 vagas: 18 para integrantes juniores e 2 para Marketing.',
      numeros: ['20 vagas', '18', '2'],
    } satisfies TextoComNumeros,
    acao: {
      rotulo: 'Fazer inscrição',
      href: '/processoseletivo',
      novaAba: '',
    },
    contato: {
      antes: 'Dúvidas sobre o processo podem ser enviadas para',
      email: 'lina@facom.ufu.br',
      depois: 'A inscrição é feita exclusivamente pelo formulário, não por e-mail.',
    },
  },
} as const;
