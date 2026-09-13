import { campi, instituicao } from '@/content/institucional';

/**
 * JSON-LD de EducationalOrganization com **apenas os campos que existem**.
 *
 * A regra vale para todo campo: dado ausente fica de fora, nunca vira string
 * vazia. `sameAs` não entra enquanto as redes sociais não tiverem URL, e `logo`
 * não entra porque o Schema.org pede raster em URL absoluta e a identidade
 * entregou SVG - é a mesma pendência da imagem de Open Graph em
 * `app/layout.tsx`, e as duas se resolvem com o mesmo arquivo.
 *
 * Campo novo entra com a guarda junto: o `...(x ? { … } : {})` abaixo é o
 * padrão da casa, não um jeito torto de escrever `if`.
 */
export function organizationJsonLd(): string {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: instituicao.nomeCompleto,
    alternateName: instituicao.nome,
    description: `${instituicao.descricaoCurta} da ${instituicao.faculdade} da ${instituicao.universidade}.`,
    url: instituicao.url,
    email: instituicao.email,
    parentOrganization: {
      '@type': 'CollegeOrUniversity',
      name: instituicao.universidade,
      department: {
        '@type': 'Organization',
        name: instituicao.faculdade,
      },
    },
    // Dois endereços: a organização opera em dois campi. Campo ausente na fonte
    // fica ausente aqui - dado que não existe não vira string vazia.
    address: campi.map((campus) => ({
      '@type': 'PostalAddress',
      ...(campus.logradouro ? { streetAddress: campus.logradouro } : {}),
      addressLocality: campus.cidade,
      addressRegion: campus.uf,
      ...(campus.cep ? { postalCode: campus.cep } : {}),
      addressCountry: 'BR',
    })),
    inLanguage: 'pt-BR',
  };

  return JSON.stringify(data);
}
