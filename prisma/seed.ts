import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Inicializando seed do banco de dados lina_bd...');

  // 1. Inicializa a flag de processo seletivo (ID 1 = Aberto)
  const openProcess = await prisma.openProcess.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      isOpen: true,
    },
  });
  console.log('✔ Tabela open_process configurada: isOpen =', openProcess.isOpen);

  // 2. Cria usuário administrador inicial padrão
  const email = 'admin@lina.facom.ufu.br';
  const defaultPassword = 'LinaAdmin@2026';
  const hash = await bcrypt.hash(defaultPassword, 10);

  const admin = await prisma.usuario.upsert({
    where: { email },
    update: {
      senha: hash,
      nome: 'Coordenação LINA',
    },
    create: {
      email,
      senha: hash,
      nome: 'Coordenação LINA',
    },
  });

  console.log('✔ Usuário administrador pronto:', admin.email);
  console.log('   Senha provisória padrão: LinaAdmin@2026');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
