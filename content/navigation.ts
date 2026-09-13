// Navegação âncora do Header e do Footer. Os rótulos são os nomes das seções da
// página, não conteúdo institucional - por isso vivem aqui, e não junto dos
// dados das seções.

import { inscricoesAbertas } from '@/content/processo-seletivo';

export interface NavItem {
  readonly href: string;
  readonly label: string;
  /**
   * Id da seção correspondente. Precisa bater com o `id` do `<section>` em
   * `components/sections/`, porque é por ele que o observador de seção ativa
   * encontra o elemento - e `href` é esse mesmo id com `#`. Os três andam
   * juntos: id errado não quebra nada, só faz o item nunca ficar ativo.
   */
  readonly id: string;
}

export const navItems: readonly NavItem[] = [
  { href: '#sobre', label: 'Sobre', id: 'sobre' },
  { href: '#pilares', label: 'Pilares', id: 'pilares' },
  { href: '#divisoes', label: 'Divisões', id: 'divisoes' },
  { href: '#atuacao', label: 'Atuação', id: 'atuacao' },
  { href: '#processo-seletivo', label: 'Processo seletivo', id: 'processo-seletivo' },
  { href: '#equipe', label: 'Equipe', id: 'equipe' },
  { href: '#faq', label: 'Dúvidas', id: 'faq' },
];

/**
 * O CTA aponta para a seção, e não direto para o formulário: o visitante
 * precisa passar pelos requisitos - 16h por semana não é detalhe - antes de
 * decidir. Com a célula de inscrição na abertura da seção, o formulário está à
 * vista no destino, que é o que torna o rótulo de ação honesto.
 *
 * O rótulo segue o estado do ciclo. Fechadas as inscrições, ele volta sozinho a
 * ser convite à leitura: prometer "Inscreva-se" sem formulário aberto é a
 * versão nova do botão morto que este projeto proíbe.
 */
export const ctaHref = '#processo-seletivo';
export const ctaLabel = inscricoesAbertas ? 'Inscreva-se' : 'Ver como entrar';
