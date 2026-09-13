'use server';

import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { revalidatePath } from 'next/cache';

export async function getProcessStatus(): Promise<boolean> {
  try {
    const processRecord = await prisma.openProcess.findFirst({
      where: { id: 1 },
    });

    if (!processRecord) {
      // Se ainda não existir registro, cria como aberto por padrão
      const created = await prisma.openProcess.create({
        data: { id: 1, isOpen: true },
      });
      return created.isOpen;
    }

    return processRecord.isOpen;
  } catch (error) {
    console.error('Erro ao consultar status do processo seletivo:', error);
    // Em caso de falha de conexão inicial, retorna true para não bloquear caso o banco esteja reiniciando
    return true;
  }
}

export async function toggleProcessStatus(isOpen: boolean) {
  const session = await getSession();
  if (!session) {
    throw new Error('Não autorizado. Apenas administradores podem alterar o status do processo.');
  }

  try {
    const updated = await prisma.openProcess.upsert({
      where: { id: 1 },
      update: { isOpen },
      create: { id: 1, isOpen },
    });

    revalidatePath('/processoseletivo');
    revalidatePath('/dashboard');
    revalidatePath('/');

    return { success: true, isOpen: updated.isOpen };
  } catch (error) {
    console.error('Erro ao atualizar status do processo seletivo:', error);
    return { success: false, error: 'Falha ao salvar no banco de dados.' };
  }
}
