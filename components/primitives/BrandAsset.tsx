import { brandAssets, type BrandVariant } from '@/content/brand';
import { cn } from '@/lib/utils';

export interface BrandAssetProps {
  variant: BrandVariant;
  /** Sobrescreve o alt do manifesto. String vazia torna o asset decorativo. */
  alt?: string;
  /** `eager` só para logo acima da dobra. */
  loading?: 'lazy' | 'eager';
  className?: string;
}

/**
 * A indireção dos logos. Nenhum componente aponta para arquivo de imagem: a
 * variante nomeada resolve caminho, dimensão e alt em `content/brand.ts`.
 *
 * A proporção do manifesto é imposta por `aspect-ratio` e o desenho é encaixado
 * com `object-contain`. É isso que cumpre a regra de dimensão reservada: se o
 * arquivo definitivo chegar com outra proporção, ele sobra ou falta dentro da
 * caixa, mas a caixa não muda de tamanho e o layout não se mexe.
 */
export function BrandAsset({
  variant,
  alt,
  loading = 'lazy',
  className,
}: Readonly<BrandAssetProps>) {
  const asset = brandAssets[variant];
  const resolvedAlt = alt ?? asset.alt;

  // Os assets são SVG e o build é `output: 'export'` com
  // `images.unoptimized`, então `next/image` não otimiza nada e só acrescenta
  // wrapper e JS. A regra do Next assume otimização que aqui não existe.
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={asset.src}
      alt={resolvedAlt}
      width={asset.width}
      height={asset.height}
      loading={loading}
      decoding="async"
      aria-hidden={resolvedAlt === '' ? true : undefined}
      style={{ aspectRatio: `${asset.width} / ${asset.height}` }}
      className={cn('h-auto max-w-full object-contain', className)}
    />
  );
}
