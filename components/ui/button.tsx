import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';

import { cn } from '@/lib/utils';

// Editado a partir do shadcn/ui para as variantes que a marca precisa.
// - `destructive` removida: a paleta LINA não tem vermelho e não se inventa cor.
// - `secondary` e `link` removidas: nada na página pede.
// - classes `dark:` removidas: a página não tem dark mode.
// - anel de foco do shadcn removido: o foco é o anel duplo global aplicado em
//   :focus-visible por app/globals.css, igual em toda a página.
//
// A transição é só de cor, e de propósito: o salto de electric para deep no
// hover é de 1.53 e sem amaciamento lê como troca de estado, não como resposta.
// O anel de foco fica de fora porque é box-shadow - foco não se atrasa.
//
// Cada variante redeclara `--lina-surface-fg` com a cor de texto que ela mesma
// impõe. O botão é a única superfície da página que não é uma Cell: ele pinta
// fundo próprio, inclusive no hover, e sem isso o cursor herdaria o slot da
// célula de trás e sumiria - `ink` sobre o navy do hover contrasta 1.2.
const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors duration-150 ease-out disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        // Ação sobre superfície clara. paper sobre electric é 9.80.
        // Hover escurece para deep: royal seria o vizinho óbvio, mas muda o
        // botão em 1.04 e o usuário não veria nada acontecer. deep muda 1.53.
        solid:
          'bg-lina-electric text-lina-paper hover:bg-lina-deep [--lina-surface-fg:var(--color-lina-paper)]',
        // Contorno em navy. deep sobre paper é 14.95; invertido no hover.
        outline:
          'border-2 border-lina-deep text-lina-deep hover:bg-lina-deep hover:text-lina-paper hover:[--lina-surface-fg:var(--color-lina-paper)]',
        // Sem preenchimento em repouso, então não redeclara o slot: o texto
        // é deep e o cursor herda o da célula de trás, que é o certo. Só serve
        // sobre superfície clara - o hover em mist sumiria sobre deep.
        ghost: 'text-lina-deep hover:bg-lina-mist',
        // Sobre superfície escura electric não serve como ação (1.53 sobre
        // deep). O CTA vira preenchimento paper com texto deep, 14.95.
        inverse:
          'bg-lina-paper text-lina-deep hover:bg-lina-mist [--lina-surface-fg:var(--color-lina-deep)]',
      },
      size: {
        default: 'h-10 px-5 py-2 has-[>svg]:px-4',
        sm: 'h-8 gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-12 px-7 text-base has-[>svg]:px-5',
        icon: 'size-10',
      },
    },
    defaultVariants: {
      variant: 'solid',
      size: 'default',
    },
  },
);

function Button({
  className,
  variant = 'solid',
  size = 'default',
  asChild = false,
  ...props
}: Readonly<
  React.ComponentProps<'button'> &
    VariantProps<typeof buttonVariants> & {
      asChild?: boolean;
    }
>) {
  const Comp = asChild ? Slot.Root : 'button';

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
