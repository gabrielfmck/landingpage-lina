# LINA - Liga de Robótica e IA · FACOM/UFU

Landing page institucional da LINA, liga acadêmica de Robótica e Inteligência
Artificial da Faculdade de Computação da Universidade Federal de Uberlândia.

O site tem um trabalho só: fazer o visitante entender o que a Liga é e se
inscrever no processo seletivo. Público-alvo são estudantes de graduação da
FACOM, docentes, parceiros externos e imprensa acadêmica.

**Alvo de publicação:** `lina.facom.ufu.br` - export estático servido por Nginx.

---

## Stack

| Camada      | Escolha                            | Observação                                           |
| ----------- | ---------------------------------- | ---------------------------------------------------- |
| Framework   | Next.js 16 (App Router)            | `output: 'export'` - sem servidor, sem route handler |
| Linguagem   | TypeScript `strict`                | sem `any`, sem `@ts-ignore`                          |
| Estilo      | Tailwind CSS v4                    | tokens no `@theme` de `app/globals.css`              |
| Componentes | shadcn/ui em `components/ui`       | copiados para o repo, editáveis                      |
| Ícones      | lucide-react                       |                                                      |
| Qualidade   | ESLint + Prettier + `tsc --noEmit` | rodar antes de qualquer commit                       |
| Pacotes     | pnpm                               | versão fixada em `packageManager`                    |

Não há backend, banco de dados nem variável de ambiente: o build gera HTML
estático. Qualquer funcionalidade que exija servidor está fora do escopo desta
página.

---

## Requisitos

- Node.js **≥ 20.9**
- pnpm **10.20** (`corepack enable` já resolve, a versão está no `package.json`)

## Começando

```bash
pnpm install
pnpm dev            # http://localhost:3000
```

## Scripts

| Comando             | O que faz                                             |
| ------------------- | ----------------------------------------------------- |
| `pnpm dev`          | servidor de desenvolvimento                           |
| `pnpm build`        | gera o site estático em `out/`                        |
| `pnpm start`        | serve `out/` - é assim que se confere o que vai ao ar |
| `pnpm typecheck`    | `tsc --noEmit`                                        |
| `pnpm lint`         | ESLint                                                |
| `pnpm format`       | Prettier (escrita)                                    |
| `pnpm format:check` | Prettier (verificação)                                |
| `pnpm verify`       | typecheck + lint + format:check, nesta ordem          |

> Verifique sempre contra `pnpm build` + `pnpm start`, e não contra o dev
> server: o dev server já serviu CSS em cache e produziu falso negativo mais de
> uma vez. O que se mede é o que vai ao ar.

---

## Estrutura

```
app/
  layout.tsx        fontes, metadata, JSON-LD, shell
  page.tsx          composição das seções, nada além
  globals.css       @theme com todos os tokens de design
  icon0.png         favicon PNG 64px (Safari 16 e anteriores)
  icon1.svg         favicon SVG (navegadores modernos)
  apple-icon.png    ícone de tela de início do iOS, 180px
components/
  ui/               shadcn/ui
  primitives/       Cell, CellGrid, BracketLabel, SectionHeader,
                    BrandAsset, Numerais, Reveal, Cursor
  layout/           Header e MobileMenu - shell, não é seção
  sections/         Hero, Sobre, Pilares, Divisoes, Atuacao,
                    ProcessoSeletivo, Equipe, FAQ, Footer
content/
  *.ts              dados tipados de cada seção
lib/
  utils.ts, seo.ts
public/brand/       logos da identidade, em SVG
```

Imports absolutos via `@/` (configurado em `tsconfig.json`).

### Duas regras que sustentam a manutenção

**1. Conteúdo mora em `content/`, nunca em JSX.** Cada seção importa um array
tipado e apenas renderiza. É isso que permite a próxima gestão da Liga atualizar
o site sem abrir um componente.

**2. Campo que pode faltar é tipado como opcional.** As seções degradam pelo
tipo, e não por condicional espalhada pelo JSX: documento sem link some da
lista, divisão sem escopo não renderiza a frase, membro sem cargo aparece só com
o nome. Nunca existe link quebrado nem texto de enchimento na página.

---

## Manutenção do conteúdo

Quase tudo o que a Liga precisa mudar entre um ciclo e outro está em
`content/`. Os pontos mais usados:

### Abrir e fechar o processo seletivo

Em [content/processo-seletivo.ts](content/processo-seletivo.ts):

```ts
export const inscricoesAbertas: boolean = true;
export const encerramentoDasInscricoes = '18 de setembro';
```

`inscricoesAbertas` é a única chave a mexer quando o prazo vence, e ela move
quatro coisas de uma vez: o botão do formulário some, a célula passa a declarar
o ciclo fechado, a linha de status do Hero deixa de renderizar e o CTA do Hero e
do Header volta de "Inscreva-se" para "Ver como entrar".

O build é estático e **não calcula "hoje"**. Se ninguém virar a chave e
rebuildar, a primeira tela segue anunciando inscrições abertas.

A data-limite vive só em `encerramentoDasInscricoes`; o Hero e a seção leem
dali. Prazo digitado em dois arquivos é como um site termina com dois prazos
diferentes.

### Outros pontos de edição frequente

| O que mudar                   | Onde                                                 |
| ----------------------------- | ---------------------------------------------------- |
| Membros, orientadores, órgãos | [content/equipe.ts](content/equipe.ts)               |
| Endereços, e-mail, documentos | [content/institucional.ts](content/institucional.ts) |
| Perguntas do FAQ              | [content/faq.ts](content/faq.ts)                     |
| Rótulos do menu e do CTA      | [content/navigation.ts](content/navigation.ts)       |
| Divisões (IA, R, ML)          | [content/divisoes.ts](content/divisoes.ts)           |
| Ano do copyright              | [content/institucional.ts](content/institucional.ts) |

O ano do rodapé é literal, e não `new Date()`: num build estático a data
congelaria no dia em que alguém gerou o pacote e passaria a mentir sem avisar.

### Regras de conteúdo

- **Dado institucional vem de norma**, não de memória: Resolução CONFACOM
  24/2025 (Regimento), Estatuto e o edital do ciclo corrente. Onde o Regimento e
  o Estatuto divergirem, vale o Regimento - é resolução publicada, e o Estatuto
  ainda é minuta. Onde o edital restringir, o edital vence para o ciclo.
- **A Liga se chama LINA.** Documentos antigos usam outro nome; ele não pode
  aparecer em lugar nenhum.
- **Campo sem fonte não é preenchido com plausível.** Deixe opcional e sem
  valor: a seção já sabe degradar.

---

## Sistema de design

Todos os tokens vivem em um único lugar - o `@theme` de
[app/globals.css](app/globals.css). **Nenhuma cor literal em componente, em
classe arbitrária do Tailwind ou em arquivo de conteúdo.**

### Paleta

```
--color-lina-electric   #0000E6   azul elétrico - ação e CTA
--color-lina-royal      #182ACA   azul royal - superfícies e gráficos
--color-lina-deep       #060C86   navy profundo - display e fundo escuro
--color-lina-facom      #006EB9   azul FACOM - só onde a UFU aparece
--color-lina-slate      #2D2D91   índigo dessaturado - texto secundário
--color-lina-ink        #0A1033   quase-preto azulado - corpo de texto
--color-lina-paper      #FFFFFF   fundo padrão
--color-lina-mist       #F2F3FB   fundo alternado de seção
```

Cores de divisão, usadas **exclusivamente** para identificar a divisão - nunca
como decoração e nunca em gradiente. Cada uma tem a cor viva (preenchimento) e a
variante `-text` (texto e contorno sobre superfície clara):

```
--color-lina-ia   #00BFD9   --color-lina-ia-text   #007A8A
--color-lina-r    #E9782C   --color-lina-r-text    #AC5820
--color-lina-ml   #E82EE8   --color-lina-ml-text   #BB25BB
```

Três restrições que não são preferência, e sim contraste medido:

- `royal` nunca é adjacente a `electric` - os dois contrastam 1.04.
- Sobre superfície escura, `electric` não serve como ação: CTA sobre escuro é
  preenchimento `paper` com texto `deep`.
- Texto sobre cor viva é sempre `ink`, o único token que passa AA sobre as três.
  Hierarquia dentro de uma célula de divisão vem de tamanho e peso, nunca de cor.

### Superfície é um contrato de quatro slots

`data-surface` redeclara `--lina-surface` (offset do foco), `--lina-surface-fg`
(texto), `--lina-surface-display` (título) e `--lina-surface-muted`
(secundário). Nenhum deles é cor nova - todos resolvem para token do `@theme`.
Componente que precisa de cor dependente de superfície **lê o slot**, em vez de
decidir por conta: é assim que `Cell`, o `Header` e o cursor usam a mesma
definição.

### Foco

Anel duplo em `box-shadow`, com 2px de offset na cor da superfície entre o
elemento e o anel. Um utilitário só, aplicado em `:focus-visible`, igual em toda
a página - não há token de foco por superfície.

```
--color-lina-focus-inner  #C7D2FE
--color-lina-focus-outer  #0A1033
```

### Tipografia

Três papéis, carregados via `next/font/google` com `display: 'swap'` e subset
latin:

- **Sora** - display: `h1`, `h2` e número que seja elemento de display autônomo.
- **Inter Tight** - corpo, todo o resto.
- **JetBrains Mono** - eyebrows, labels, metadados e o motivo `< FACOM - UFU`.

Número dentro de parágrafo é Inter Tight 600 com `tabular-nums` (o primitivo
`Numerais` cuida disso) - nunca Sora, e nunca em bloco de estatísticas.

### A célula

O cérebro do logo é feito de blocos de cantos arredondados separados por
costuras de fundo, e a página inteira herda esse motivo: superfícies são células
com `border-radius` generoso e gaps visíveis de 4-6px que deixam o fundo
aparecer. **As costuras são a assinatura da marca, não sobra de layout** - não
as elimine para "limpar" a composição.

Em aninhamento vale o **raio concêntrico**: o raio interno é o externo menos o
padding. Daí `--radius-cell-lg` (32px) com `padding="sm"` (16px) pedir
exatamente `--radius-cell-sm` (16px).

### Marca

Nenhum componente referencia arquivo de imagem direto. Todo logo passa por
`<BrandAsset variant="..." />`, que resolve caminho, proporção e `alt` a partir
de [content/brand.ts](content/brand.ts). Cada variante tem dimensão reservada
tirada do viewBox do arquivo - é dela que sai o `aspect-ratio` que segura o CLS
em zero.

Sobre superfície `deep` ou `royal`, use a variante `-negativo`. Quem escolhe é o
componente que conhece a própria superfície, e **o sinal é a superfície da
célula, não a da seção**: o rodapé é `mist` e a célula da marca dentro dele é
`deep`.

A página **não tem dark mode** - nenhum `prefers-color-scheme`, nenhum toggle,
nenhuma classe `.dark`. Seções escuras existem, mas são decisão de composição
usando `--color-lina-deep`.

---

## Padrão de qualidade

Todo componente entregue passa nisto:

- Responsivo de 320px a 2560px, conferido nos dois extremos.
- `lang="pt-BR"`. Sem i18n.
- Semântica correta: `<section>`, `<nav>`, um `<h1>` único, hierarquia sem pulo.
- Navegação completa por teclado, com foco visível em toda parada.
- Contraste mínimo AA.
- `prefers-reduced-motion: reduce` desliga toda animação de deslocamento.
- Imagem com `alt` descritivo; decorativa com `alt=""`.
- Zero erro de hidratação, zero warning no console.
- Sem layout shift: toda imagem e todo embed com dimensão reservada.

### Orçamento de performance

Metas de Lighthouse mobile: **Performance ≥ 90, Acessibilidade 100, SEO 100**,
com **LCP < 2.5s** e **CLS < 0.05**.

O orçamento de JavaScript é o delta: no máximo **+45 KB gzip** sobre os 169 KB
de first load medidos na página vazia, somando todas as bibliotecas de
terceiros. O byte é meio; a métrica é fim.

Camada de movimento sem biblioteca: `<dialog>` nativo resolve presença e foco do
menu mobile, o accordion é `<details>` nativo, reveal por scroll é
`IntersectionObserver` acionando transição CSS, e hover é estado. Antes de
instalar um componente de biblioteca, confira se um elemento nativo resolve.

---

## Deploy

`pnpm build` gera `out/`, um diretório por rota com `index.html`
(`trailingSlash: true`). O pacote de entrega é `out/` mais a configuração do
Nginx.

### Antes de empacotar

1. `pnpm verify` - typecheck, lint e format.
2. `pnpm build` sem warning.
3. `pnpm start` e confira a página servida a partir de `out/`.
4. `git status` limpo.
5. Confira que `inscricoesAbertas` e `encerramentoDasInscricoes` refletem o
   ciclo corrente.

### Nginx

A configuração tem **apenas o bloco 80**, sem bloco 443 e sem redirect para
HTTPS. O TLS termina antes, no servidor da FACOM; um redirect aqui criaria loop.

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

Com `trailingSlash: true` o `try_files` é trivial: cada rota já é um diretório
com `index.html` dentro.

---

## Licença

Projeto institucional da LINA - Liga de Robótica e IA, FACOM/UFU. Os arquivos de
`public/brand/` são a identidade visual da Liga e não são de uso livre.
