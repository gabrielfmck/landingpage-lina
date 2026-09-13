'use server';

import fs from 'node:fs/promises';
import path from 'node:path';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/session';
import { revalidatePath } from 'next/cache';

async function requireAdminSession() {
  const session = await getSession();
  if (!session) {
    throw new Error('Sessão expirada ou usuário não autenticado.');
  }
  return session;
}

export async function getDashboardData() {
  await requireAdminSession();

  const [candidatos, statusProcesso, totalAdmins] = await Promise.all([
    prisma.candidato.findMany({
      orderBy: { createdAt: 'desc' },
    }),
    prisma.openProcess.findFirst({ where: { id: 1 } }),
    prisma.usuario.count(),
  ]);

  const stats = {
    total: candidatos.length,
    robotica: candidatos.filter((c) => c.areaAtuacao.includes('Robótica')).length,
    ia: candidatos.filter((c) => c.areaAtuacao.includes('IA')).length,
    marketing: candidatos.filter((c) => c.areaAtuacao.includes('Marketing')).length,
    comHistorico: candidatos.filter((c) => !!c.historicoUrl).length,
    comCertificados: candidatos.filter((c) => !!c.certificadosUrl).length,
    isOpen: statusProcesso ? statusProcesso.isOpen : true,
    totalAdmins,
  };

  return { candidatos, stats };
}

export async function getAdminUsers() {
  await requireAdminSession();
  const admins = await prisma.usuario.findMany({
    select: {
      id: true,
      email: true,
      nome: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'asc' },
  });
  return admins;
}

export async function createAdminUser(formData: FormData) {
  await requireAdminSession();

  const count = await prisma.usuario.count();
  if (count >= 5) {
    return { success: false, error: 'Limite máximo de 5 usuários administradores atingido.' };
  }

  const nome = (formData.get('nome') as string)?.trim();
  const email = (formData.get('email') as string)?.trim().toLowerCase();
  const senha = (formData.get('senha') as string)?.trim();

  if (!nome || !email || !senha) {
    return { success: false, error: 'Preencha todos os campos para criar o administrador.' };
  }

  if (senha.length < 6) {
    return { success: false, error: 'A senha deve ter no mínimo 6 caracteres.' };
  }

  const existing = await prisma.usuario.findUnique({ where: { email } });
  if (existing) {
    return { success: false, error: 'Já existe um usuário com este e-mail.' };
  }

  const hash = await bcrypt.hash(senha, 10);
  await prisma.usuario.create({
    data: {
      nome,
      email,
      senha: hash,
    },
  });

  revalidatePath('/dashboard');
  return { success: true };
}

export async function deleteAdminUser(adminId: number) {
  const currentSession = await requireAdminSession();

  if (currentSession.id === adminId) {
    return { success: false, error: 'Você não pode excluir sua própria conta de administrador ativa.' };
  }

  const total = await prisma.usuario.count();
  if (total <= 1) {
    return { success: false, error: 'Não é possível remover o único administrador do sistema.' };
  }

  await prisma.usuario.delete({
    where: { id: adminId },
  });

  revalidatePath('/dashboard');
  return { success: true };
}

export async function getCandidateDocumentBase64(candidatoId: number, tipo: 'historico' | 'certificados') {
  await requireAdminSession();

  const candidato = await prisma.candidato.findUnique({
    where: { id: candidatoId },
  });

  if (!candidato) {
    throw new Error('Candidato não encontrado.');
  }

  const fileName = tipo === 'historico' ? candidato.historicoUrl : candidato.certificadosUrl;
  if (!fileName) {
    throw new Error('Documento não anexado por este candidato.');
  }

  const filePath = path.join(process.cwd(), 'uploads', fileName);
  try {
    const fileBuffer = await fs.readFile(filePath);
    return {
      success: true,
      fileName,
      base64: fileBuffer.toString('base64'),
    };
  } catch (error) {
    console.error('Arquivo não encontrado no disco:', error);
    return { success: false, error: 'Arquivo não encontrado no servidor.' };
  }
}
