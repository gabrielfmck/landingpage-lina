import Link from 'next/link';
import { ArrowLeft, Mail, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Cell } from '@/components/primitives/Cell';
import { BracketLabel } from '@/components/primitives/BracketLabel';

interface AvisoFechadoProps {
  emailContato?: string;
}

export function AvisoFechado({ emailContato = 'lina@facom.ufu.br' }: AvisoFechadoProps) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <Cell surface="paper" padding="lg" radius="lg" className="border border-lina-mist shadow-sm">
        <div className="flex items-center gap-3 text-lina-royal">
          <AlertCircle className="size-6 shrink-0 text-lina-electric" aria-hidden="true" />
          <BracketLabel>[ PROCESSO SELETIVO ]</BracketLabel>
        </div>

        <h1 className="mt-4 font-display text-2xl font-bold text-lina-deep sm:text-3xl">
          Processo seletivo não disponível no momento
        </h1>

        <p className="mt-4 text-base leading-relaxed text-lina-ink">
          O período de inscrições para novos integrantes da Liga Acadêmica de Robótica e Inteligência
          Artificial (LINA) está encerrado ou ainda não foi aberto para o ciclo vigente.
        </p>

        <div className="mt-6 rounded-lg bg-lina-mist p-5 text-sm text-lina-ink">
          <p className="font-semibold text-lina-deep">Acredita que isso é um erro?</p>
          <p className="mt-1 text-lina-slate">
            Caso o edital indique inscrições abertas para esta data, por favor entre em contato com a
            coordenação da LINA reportando a situação:
          </p>
          <a
            href={`mailto:${emailContato}`}
            className="mt-3 inline-flex items-center gap-2 font-medium text-lina-electric underline underline-offset-4 hover:text-lina-deep"
          >
            <Mail className="size-4" aria-hidden="true" />
            {emailContato}
          </a>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-lina-mist pt-6">
          <Button asChild variant="outline">
            <Link href="/" className="inline-flex items-center gap-2">
              <ArrowLeft className="size-4" aria-hidden="true" />
              Voltar para o início
            </Link>
          </Button>

          <Button asChild variant="solid">
            <Link href="/#processo-seletivo">Consultar Cronograma e Edital</Link>
          </Button>
        </div>
      </Cell>
    </div>
  );
}
