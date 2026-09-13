import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { Cell } from '@/components/primitives/Cell';
import { BrandAsset } from '@/components/primitives/BrandAsset';
import { LoginForm } from './LoginForm';

export const metadata: Metadata = {
  title: 'Acesso Administrativo · LINA',
  description: 'Painel restrito da coordenação do Processo Seletivo LINA/FACOM/UFU.',
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  const session = await getSession();
  if (session) {
    redirect('/dashboard');
  }

  return (
    <main id="conteudo" className="min-h-screen flex items-center justify-center bg-lina-mist/50 px-4 py-20">
      <div className="w-full max-w-md">
        <Cell surface="paper" padding="lg" radius="lg" className="border border-lina-mist shadow-lg">
          <div className="flex justify-center mb-6">
            <BrandAsset variant="lockup-horizontal-reduzido" alt="LINA" className="w-40" />
          </div>

          <h1 className="text-center font-display text-xl font-bold text-lina-deep">
            Acesso Administrativo
          </h1>
          <p className="mt-1 text-center text-xs text-lina-slate">
            Autenticação restrita da coordenação para gestão de inscrições
          </p>

          <LoginForm />
        </Cell>
      </div>
    </main>
  );
}
