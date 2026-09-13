# LINA - Liga de Robótica e IA · FACOM/UFU

Landing page institucional da LINA, liga acadêmica de Robótica e Inteligência
Artificial da Faculdade de Computação da Universidade Federal de Uberlândia.

Site estático, publicado em `lina.facom.ufu.br`.

## Stack

Next.js 16 (App Router, `output: 'export'`), TypeScript, Tailwind CSS v4,
shadcn/ui e lucide-react. Sem backend, sem banco e sem variável de ambiente.

## Requisitos

- Node.js 20.9 ou superior
- pnpm 10.20 (`corepack enable` resolve; a versão está no `package.json`)

## Começando

```bash
pnpm install
pnpm dev
```

Disponível em `http://localhost:3000`.

## Scripts

| Comando          | O que faz                       |
| ---------------- | ------------------------------- |
| `pnpm dev`       | servidor de desenvolvimento     |
| `pnpm build`     | gera o site estático em `out/`  |
| `pnpm start`     | serve `out/` localmente         |
| `pnpm typecheck` | `tsc --noEmit`                  |
| `pnpm lint`      | ESLint                          |
| `pnpm format`    | Prettier                        |
| `pnpm verify`    | typecheck + lint + format:check |

## Estrutura

```
app/           layout, página e globals.css (tokens de design)
components/
  ui/          shadcn/ui
  primitives/  Cell, CellGrid, BrandAsset, SectionHeader e afins
  layout/      Header e menu mobile
  sections/    Hero, Sobre, Pilares, Divisoes, Atuacao,
               ProcessoSeletivo, Equipe, FAQ, Footer
content/       textos e dados de cada seção
lib/           utilitários e JSON-LD
public/brand/  logos em SVG
```

Imports absolutos via `@/`. As cores, fontes e espaçamentos ficam todos no
`@theme` de `app/globals.css`.

## Atualizando o conteúdo

Os textos ficam em `content/`, separados dos componentes: dá para atualizar o
site sem abrir um arquivo de JSX.

| O que mudar                   | Onde                           |
| ----------------------------- | ------------------------------ |
| Processo seletivo e prazos    | `content/processo-seletivo.ts` |
| Membros e orientadores        | `content/equipe.ts`            |
| Endereços, e-mail, documentos | `content/institucional.ts`     |
| Perguntas do FAQ              | `content/faq.ts`               |
| Menu e rótulo do CTA          | `content/navigation.ts`        |

### Fechar as inscrições

Em `content/processo-seletivo.ts`:

```ts
export const inscricoesAbertas: boolean = true;
export const encerramentoDasInscricoes = '18 de setembro';
```

Passado o prazo, troque `inscricoesAbertas` para `false` e rode `pnpm build`. O
site é estático e não calcula a data sozinho: sem isso, a página continua
anunciando inscrições abertas.

## Deploy

`pnpm build` gera `out/`, com um diretório por rota. Basta servir essa pasta.

A configuração do Nginx tem apenas o bloco 80. O TLS termina antes, no servidor
da FACOM, então não há bloco 443 nem redirect para HTTPS.

```nginx
server {
    listen 80;
    server_name lina.facom.ufu.br;

    root /var/www/lina;
    index index.html;

    location / {
        try_files $uri $uri/ $uri.html /404.html;
    }
}
```

## Licença

Projeto institucional da LINA - Liga de Robótica e IA, FACOM/UFU. Os arquivos de
`public/brand/` são a identidade visual da Liga e não são de uso livre.
