// Identificação institucional da Liga, extraída das normas e do edital vigente.
// Campo sem fonte documental é opcional e simplesmente não existe aqui.

/**
 * A Liga opera nos dois campi da FACOM. Campus é endereço, e só: nenhuma
 * divisão pertence a um deles. Os campos são opcionais para o footer degradar
 * pelo tipo quando a fonte não der o dado.
 */
export interface Campus {
  readonly cidade: string;
  readonly uf: string;
  /** Nome da unidade, quando a fonte dá. Uberlândia identifica por bairro. */
  readonly unidade?: string;
  readonly logradouro?: string;
  readonly bairro?: string;
  readonly cep?: string;
}

export interface DocumentoPublico {
  readonly titulo: string;
  /** Ausente enquanto o link estiver `[A DEFINIR]`. Item sem href não renderiza. */
  readonly href?: string;
}

export interface CanalContato {
  readonly rotulo: string;
  readonly href?: string;
  /**
   * Chave do ícone, resolvida para componente no rodapé - conteúdo é dado, não
   * componente. Chave sem ícone disponível renderiza só o rótulo, nunca um
   * ícone genérico no lugar da marca.
   */
  readonly icone?: 'email' | 'instagram' | 'github' | 'linkedin';
}

export const instituicao = {
  nome: 'LINA',
  nomeCompleto: 'LINA - Liga de Robótica e IA',
  descricaoCurta: 'Liga de Robótica e Inteligência Artificial',
  faculdade: 'Faculdade de Computação (FACOM)',
  universidade: 'Universidade Federal de Uberlândia (UFU)',
  dominio: 'lina.facom.ufu.br',
  url: 'https://lina.facom.ufu.br',
  email: 'lina@facom.ufu.br',
  marcoRegulatorio: 'Resolução CONFACOM nº 24, de 28 de julho de 2025',
} as const;

export const campi: readonly Campus[] = [
  {
    cidade: 'Uberlândia',
    uf: 'MG',
    // O Estatuto dá só o bairro; o nome do campus vem da própria UFU.
    unidade: 'Campus Santa Mônica',
    logradouro: 'Av. João Naves de Ávila, 2121',
    bairro: 'Santa Mônica',
    cep: '38408-100',
  },
  {
    cidade: 'Monte Carmelo',
    uf: 'MG',
    unidade: 'Campus Araras',
    logradouro: 'Rodovia LMG-746, km 01',
    cep: '38500-000',
  },
];

// Os três documentos ainda não têm link público e por isso não renderizam:
// item sem `href` some da lista, nunca vira link quebrado. O e-mail é o único
// destino externo da página - contato para dúvidas sobre o processo seletivo,
// não canal de inscrição.
export const documentosPublicos: readonly DocumentoPublico[] = [
  { titulo: 'Estatuto da LINA' },
  { titulo: 'Resolução CONFACOM nº 24/2025' },
  { titulo: 'Edital 01/2026 - Processo Seletivo' },
];

export const canaisContato: readonly CanalContato[] = [
  { rotulo: 'lina@facom.ufu.br', href: 'mailto:lina@facom.ufu.br', icone: 'email' },
  // Os três seguem sem `href` e por isso não renderizam. A chave de ícone já
  // está posta: quando o perfil existir, entra o `href` e o item aparece
  // inteiro.
  { rotulo: 'Instagram', icone: 'instagram' },
  { rotulo: 'GitHub', icone: 'github' },
  { rotulo: 'LinkedIn', icone: 'linkedin' },
];

/**
 * Linha de copyright do rodapé. O ano é literal, e não `new Date()`: o build é
 * estático, então a data congela no dia em que alguém gerou o pacote e passa a
 * mentir sem avisar. Literal, ele é conteúdo - mora aqui e a próxima gestão
 * atualiza junto com o resto.
 */
export const copyright = {
  ano: 2026,
  titular: 'LINA - Liga de Robótica e IA',
  aviso: 'Todos os direitos reservados.',
} as const;
