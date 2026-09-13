import type { BrandVariant } from '@/content/brand';
import { ctaHref, ctaLabel } from '@/content/navigation';
import { encerramentoDasInscricoes } from '@/content/processo-seletivo';

// O enquadramento é o do Regimento: a Liga amplia e complementa a formação
// acadêmica. Nada aqui compara a Liga com as disciplinas da própria FACOM - a
// página é pública e lida pelos docentes que ministram essas disciplinas.

export const hero = {
  eyebrow: 'FACOM - UFU',
  titulo: 'Inteligência Artificial e Robótica além da grade curricular.',
  sublinha:
    'Liga acadêmica da FACOM-UFU, criada e organizada por estudantes sob coordenação de docentes. Ensino, pesquisa e extensão.',
  // Só renderiza com o ciclo aberto, e a data vem de `processo-seletivo.ts`:
  // prazo digitado duas vezes é prazo que diverge.
  statusProcesso: {
    texto: `Processo seletivo aberto - inscrições até ${encerramentoDasInscricoes}.`,
    numeros: [encerramentoDasInscricoes],
  },
  // Href e rótulo vêm da navegação para o hero e o header nunca divergirem, e
  // porque o rótulo depende do estado do ciclo. Continua âncora para a seção.
  ctaPrimario: {
    href: ctaHref,
    rotulo: ctaLabel,
  },
  ctaSecundario: {
    href: '#sobre',
    rotulo: 'Conhecer a Liga',
  },
  marca: 'mark' satisfies BrandVariant,
} as const;

// As três divisões vêm de content/divisoes.ts - o Hero mostra a forma curta.
export { divisoes as divisoesResumo } from '@/content/divisoes';
