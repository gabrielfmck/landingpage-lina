import type { Metadata } from 'next';
import { getProcessStatus } from '@/lib/actions/process';
import { FormularioInscricao } from './FormularioInscricao';
import { AvisoFechado } from './AvisoFechado';

export const metadata: Metadata = {
  title: 'Inscrição · Processo Seletivo LINA',
  description: 'Inscrições abertas para novos membros da Liga Acadêmica de Robótica e Inteligência Artificial (LINA/FACOM/UFU).',
};

// Força renderização dinâmica para sempre consultar a flag do banco no acesso
export const dynamic = 'force-dynamic';

export default async function ProcessoSeletivoPage() {
  const isOpen = await getProcessStatus();

  return (
    <main id="conteudo" className="min-h-screen bg-lina-mist/40 pt-header pb-16">
      {isOpen ? <FormularioInscricao /> : <AvisoFechado />}
    </main>
  );
}
