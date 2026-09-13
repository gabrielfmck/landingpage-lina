import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { getDashboardData, getAdminUsers } from '@/lib/actions/admin';
import { DashboardClient } from './DashboardClient';

export const metadata: Metadata = {
  title: 'Dashboard · Processo Seletivo LINA',
  description: 'Painel administrativo para gestão de inscritos no Processo Seletivo LINA.',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }

  const [{ candidatos, stats }, admins] = await Promise.all([
    getDashboardData(),
    getAdminUsers(),
  ]);

  return (
    <main id="conteudo">
      <DashboardClient
        initialCandidatos={candidatos}
        initialStats={stats}
        initialAdmins={admins}
        currentUserName={session.nome}
      />
    </main>
  );
}
