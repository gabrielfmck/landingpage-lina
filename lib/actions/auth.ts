'use server';

import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { createSession, destroySession, getSession } from '@/lib/session';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export interface ActionResult {
  success: boolean;
  error?: string;
}

export async function loginAction(
  _prevState: ActionResult | null,
  formData: FormData
): Promise<ActionResult> {
  const email = (formData.get('email') as string)?.trim().toLowerCase();
  const senha = (formData.get('senha') as string)?.trim();

  if (!email || !senha) {
    return { success: false, error: 'Por favor, preencha todos os campos.' };
  }

  try {
    const usuario = await prisma.usuario.findUnique({
      where: { email },
    });

    if (!usuario) {
      return { success: false, error: 'Credenciais inválidas. Verifique seu e-mail e senha.' };
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return { success: false, error: 'Credenciais inválidas. Verifique seu e-mail e senha.' };
    }

    await createSession({
      id: usuario.id,
      email: usuario.email,
      nome: usuario.nome,
    });

    return { success: true };
  } catch (error) {
    console.error('Erro ao realizar login:', error);
    return { success: false, error: 'Erro de conexão com o servidor. Tente novamente.' };
  }
}

export async function logoutAction() {
  await destroySession();
  revalidatePath('/', 'layout');
  redirect('/login');
}

export async function checkAuthStatus() {
  const session = await getSession();
  return session;
}
