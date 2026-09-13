import type { TextoComNumeros } from '@/components/primitives/Numerais';

// Diferente das outras seções, a redação do FAQ não existe pronta em nenhuma
// norma: cada pergunta é formulada aqui. A regra para entrar é uma só - só
// entra pergunta cuja resposta esteja inteira na fonte, com artigo citável no
// campo `fonte`. Pergunta que a página já responde em contexto fica de fora,
// salvo quando a formulação direta acrescenta - é o caso da 2, da 4 e da 5.
//
// Vagas e datas do ciclo corrente vivem em `ProcessoSeletivo`, e não aqui: são
// dados de edital e mudam a cada processo seletivo.

export interface Pergunta extends TextoComNumeros {
  readonly id: string;
  readonly pergunta: string;
  /** Artigos que sustentam a resposta. Não renderiza; existe para auditoria. */
  readonly fonte: string;
}

export const secaoFaq = {
  eyebrow: 'Dúvidas',
  titulo: 'O que costuma ficar em aberto.',
} as const;

export const perguntas: readonly Pergunta[] = [
  {
    id: 'outra-unidade',
    pergunta: 'Posso me inscrever se estudo em outra unidade da UFU?',
    texto:
      'Neste processo seletivo, não. O Edital 01/2026 abriu vagas para estudantes com matrícula regular em curso de graduação da FACOM-UFU. O Regimento das Ligas prevê a categoria de Membro Efetivo Externo para discentes de outras unidades da UFU, com o limite de que externos não ultrapassem 40% do quadro - cada edital define se abre para essa categoria.',
    numeros: ['40%'],
    fonte: 'Regimento, Art. 7º §§ 1º e 2º e Art. 15; Edital 01/2026',
  },
  {
    id: 'faltas',
    pergunta: 'O que acontece se eu faltar?',
    texto:
      'Faltas em reuniões obrigatórias exigem justificativa documentada, entregue por escrito ao Secretário-Geral em até 7 dias. Aceita a justificativa, a contagem passa a correr apenas a partir do fim da razão impeditiva. Sem justificativa, faltar a mais de 25% das reuniões ou atividades leva ao desligamento.',
    numeros: ['7 dias', '25%'],
    fonte: 'Estatuto, Art. 26 § único, Art. 29 e § 1º, Art. 51',
  },
  {
    id: 'trancamento',
    pergunta: 'Posso trancar minha vaga?',
    texto:
      'Sim. É permitido ao discente trancar a vaga em casos de atividades que exijam afastamento das atividades acadêmicas, desde que documentado junto à Coordenação de Extensão e seguindo as Normas de Graduação da UFU.',
    numeros: [],
    fonte: 'Regimento, Art. 25 § 2º',
  },
  {
    id: 'perder-certificado',
    pergunta: 'Existe alguma situação em que eu perco o certificado?',
    texto:
      'Sim. O certificado depende de completar o ano mínimo com a frequência exigida. Além disso, o Presidente e os Tutores podem excluir membro por abandono ou conduta inadequada, e quem é excluído não tem direito ao certificado.',
    numeros: [],
    fonte: 'Regimento, Art. 30 e Art. 41',
  },
  {
    id: 'duas-ligas',
    pergunta: 'Posso participar de duas ligas ao mesmo tempo?',
    texto:
      'A LINA não impede. Mas a certificação é limitada: cada estudante pode ser certificado por apenas uma Liga por ano.',
    numeros: [],
    fonte: 'Resolução CONFACOM 24/2025, Art. 43',
  },
  {
    id: 'custo',
    pergunta: 'A Liga tem custo?',
    texto:
      'Não. A inscrição no processo seletivo é gratuita e não se cobra taxa de inscrição.',
    numeros: [],
    fonte: 'Regimento, Art. 24 § 2º',
  },
];
