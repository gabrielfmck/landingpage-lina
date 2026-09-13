import { Mail, type LucideIcon } from 'lucide-react';

import { BracketLabel } from '@/components/primitives/BracketLabel';
import { BrandAsset } from '@/components/primitives/BrandAsset';
import { Cell } from '@/components/primitives/Cell';
import { CellGrid } from '@/components/primitives/CellGrid';
import {
  campi,
  canaisContato,
  copyright,
  documentosPublicos,
  instituicao,
  type CanalContato,
} from '@/content/institucional';
import { navItems } from '@/content/navigation';

/**
 * Chave de ícone → componente. Só o e-mail tem: o lucide 1.x removeu os ícones
 * de marca, então Instagram, GitHub e LinkedIn não existem no pacote. Rede
 * social renderiza o rótulo sozinho até haver decisão sobre de onde vem a
 * marca - ícone genérico no lugar de uma logo é pior que ícone nenhum.
 */
const ICONE: Partial<Record<NonNullable<CanalContato['icone']>, LucideIcon>> = {
  email: Mail,
};

/**
 * Nasce escasso e é desenhado assim. Enquanto documentos públicos e redes
 * sociais não tiverem link, eles simplesmente não entram - nunca link quebrado,
 * nunca enchimento para disfarçar a escassez.
 *
 * O contato mora na célula da marca, e não na de navegação, por dois motivos:
 * a célula escura era a mais vazia das três, e o e-mail é a única ação para
 * fora que a página tem - fica na superfície de maior peso visual.
 *
 * Fora de `<main>`, em `app/page.tsx`: é conteúdo do site, não da página. Tem
 * `id` mesmo sem estar na navegação, porque o `scroll-margin-top` das âncoras
 * casa com `footer[id]`.
 */
export function Footer() {
  // Os dois filtros são a degradação por tipo: `href` é opcional na fonte, e
  // item sem link some da lista em vez de virar âncora morta. Chegando o link
  // em `content/institucional.ts`, o item aparece sozinho.
  const documentosComLink = documentosPublicos.filter((doc) => doc.href !== undefined);
  const contatosComLink = canaisContato.filter((canal) => canal.href !== undefined);

  return (
    <footer id="footer" className="bg-lina-mist px-6 pt-16 pb-10">
      <div className="mx-auto max-w-6xl">
        <CellGrid columns={4}>
          <Cell surface="deep" padding="lg" radius="md">
            {/* A célula é `deep`, não a seção: o rodapé é claro, mas esta
                célula é escura, e o lockup azul desaparece dentro dela. */}
            <BrandAsset variant="lockup-vertical-negativo" className="w-28" />
            <p className="text-on-surface-muted mt-6 text-sm">
              {instituicao.descricaoCurta}
            </p>

            {contatosComLink.length > 0 ? (
              <>
                <BracketLabel className="text-on-surface-muted mt-8 block">
                  Contato
                </BracketLabel>
                <ul className="mt-4 flex flex-col gap-2">
                  {contatosComLink.map((canal) => {
                    const Icone = canal.icone ? ICONE[canal.icone] : undefined;

                    return (
                      <li key={canal.rotulo}>
                        <a
                          href={canal.href}
                          className="inline-flex items-center gap-2 rounded-md text-sm hover:underline"
                        >
                          {Icone ? (
                            <Icone aria-hidden="true" className="size-4 shrink-0" />
                          ) : null}
                          {canal.rotulo}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </>
            ) : null}
          </Cell>

          <Cell surface="paper" padding="lg" radius="md">
            <BracketLabel className="text-on-surface-muted">Navegação</BracketLabel>
            <nav aria-label="Navegação do rodapé" className="mt-4">
              <ul className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <li key={item.id}>
                    <a href={item.href} className="rounded-md text-sm hover:underline">
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {documentosComLink.length > 0 ? (
              <>
                <BracketLabel className="text-on-surface-muted mt-8 block">
                  Documentos
                </BracketLabel>
                <ul className="mt-4 flex flex-col gap-2">
                  {documentosComLink.map((doc) => (
                    <li key={doc.titulo}>
                      <a href={doc.href} className="rounded-md text-sm hover:underline">
                        {doc.titulo}
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
          </Cell>

          <Cell surface="paper" padding="lg" radius="md" span={2}>
            <BracketLabel className="text-on-surface-muted">FACOM - UFU</BracketLabel>
            <p className="mt-4 text-sm font-medium">{instituicao.faculdade}</p>
            <p className="text-on-surface-muted text-sm">{instituicao.universidade}</p>

            {/* Os dois campi onde a Liga opera. Endereço e nada mais: nenhuma
                divisão pertence a um campus, e rotular cada um com uma frente
                afirmaria uma separação que a Liga não tem.

                Lado a lado a partir de `sm`: empilhados, eles faziam desta a
                célula mais alta do rodapé e a altura dela vazava para as outras
                duas, que o grid estica junto. */}
            <div className="mt-5 grid gap-x-8 gap-y-5 sm:grid-cols-2">
              {campi.map((campus) => (
                <address key={campus.cidade} className="text-sm not-italic">
                  <span className="block font-medium">
                    {campus.cidade} - {campus.uf}
                  </span>
                  <span className="text-on-surface-muted mt-1 block">
                    {campus.unidade ? (
                      <>
                        {campus.unidade}
                        <br />
                      </>
                    ) : null}
                    {campus.logradouro}
                    {campus.bairro ? (
                      <>
                        <br />
                        {campus.bairro}
                      </>
                    ) : null}
                    {campus.cep ? (
                      <>
                        <br />
                        CEP {campus.cep}
                      </>
                    ) : null}
                  </span>
                </address>
              ))}
            </div>
          </Cell>
        </CellGrid>

        {/* Barra inferior: quem detém e sob que norma. Os dois são identificação
            institucional e ficam nas pontas da mesma linha; abaixo de `sm`
            empilham, porque a linha inteira não cabe em 320px. */}
        <div className="text-on-surface-muted mt-8 flex flex-col gap-2 text-xs sm:flex-row sm:items-baseline sm:justify-between">
          <p>
            © {copyright.ano} {copyright.titular}. {copyright.aviso}
          </p>
          <p>{instituicao.marcoRegulatorio}</p>
        </div>
      </div>
    </footer>
  );
}
