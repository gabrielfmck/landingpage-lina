import { BracketLabel } from '@/components/primitives/BracketLabel';
import { cn } from '@/lib/utils';

export type SectionHeaderLevel = 'h1' | 'h2' | 'h3';

export interface SectionHeaderProps {
  /** Eyebrow. Omitido, o cabeçalho começa no título. */
  label?: string;
  title: string;
  subtitle?: string;
  /** Nível semântico. A página tem um único `h1`, então o padrão é `h2`. */
  as?: SectionHeaderLevel;
  /** Vai no título, para servir de alvo de âncora. */
  id?: string;
  className?: string;
}

/**
 * BracketLabel, título em Sora e subtítulo opcional, com espaçamento
 * consistente. Título e subtítulo usam os slots de superfície, então o
 * cabeçalho funciona igual sobre claro e sobre escuro.
 */
export function SectionHeader({
  label,
  title,
  subtitle,
  as = 'h2',
  id,
  className,
}: Readonly<SectionHeaderProps>) {
  const Heading = as;

  return (
    <header
      data-reveal-group
      data-reveal-header
      className={cn('flex flex-col gap-3', className)}
    >
      {label ? (
        <BracketLabel className="text-on-surface-muted">{label}</BracketLabel>
      ) : null}
      <Heading
        id={id}
        className="font-display text-on-surface-display text-3xl font-semibold text-balance md:text-4xl"
      >
        {title}
      </Heading>
      {subtitle ? (
        <p className="text-on-surface-muted max-w-prose text-base md:text-lg">
          {subtitle}
        </p>
      ) : null}
    </header>
  );
}
