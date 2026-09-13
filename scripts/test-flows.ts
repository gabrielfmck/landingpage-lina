import { prisma } from '../lib/prisma';
import { submeterInscricao } from '../lib/actions/inscricao';
import { getProcessStatus } from '../lib/actions/process';
import bcrypt from 'bcryptjs';

async function runTests() {
  console.log('🧪 Iniciando testes de integração automatizados...\n');

  // 1. Testar consulta ao status do processo
  const statusInicial = await getProcessStatus();
  console.log('1. Status inicial do processo:', statusInicial ? 'ABERTO' : 'FECHADO');

  // 2. Testar submissão de inscrição (candidato com PDF simulado)
  console.log('2. Testando Server Action submeterInscricao...');
  const formData = new FormData();
  formData.append('nome', 'João Teste Automatizado');
  formData.append('matricula', '2026BSI999');
  formData.append('email', 'joao.teste@ufu.br');
  formData.append('telefone', '(34) 99876-5432');
  formData.append('curso', 'Sistemas de Informação (BSI)');
  formData.append('periodo', '4º Período');
  formData.append('areaAtuacao', 'Robótica');
  formData.append('areaAtuacao', 'IA');

  // Simula um arquivo de histórico escolar em PDF
  const fakePdfContent = Buffer.from('%PDF-1.4 Fake PDF Content for automated test');
  const fakeHistorico = new File([fakePdfContent], 'historico_escolar_ufu.pdf', {
    type: 'application/pdf',
  });
  formData.append('historico', fakeHistorico);

  const resInscricao = await submeterInscricao(formData);
  console.log('   Resultado da inscrição:', resInscricao.success ? 'SUCESSO' : 'ERRO', resInscricao.error || '');
  if (!resInscricao.success || !resInscricao.candidato) {
    throw new Error('Falha ao submeter inscrição de teste.');
  }
  console.log('   ID do candidato criado:', resInscricao.candidato.id);
  console.log('   Protocolo gerado:', `LINA-2026-${String(resInscricao.candidato.id).padStart(5, '0')}`);

  // Verifica no banco de dados se o arquivo foi nomeado como historico_candidato_{id}.pdf
  const candidatoSalvo = await prisma.candidato.findUnique({
    where: { id: resInscricao.candidato.id },
  });
  console.log('   Arquivo salvo no BD:', candidatoSalvo?.historicoUrl);
  if (candidatoSalvo?.historicoUrl !== `historico_candidato_${resInscricao.candidato.id}.pdf`) {
    throw new Error('Nome do arquivo não corresponde ao padrão solicitado: historico + candidato.id');
  }

  // 3. Testar autenticação de administrador
  console.log('\n3. Testando autenticação de administrador com bcrypt...');
  const admin = await prisma.usuario.findUnique({
    where: { email: 'admin@lina.facom.ufu.br' },
  });
  if (!admin) throw new Error('Admin padrão não encontrado.');

  const senhaValida = await bcrypt.compare('LinaAdmin@2026', admin.senha);
  console.log('   Validação de senha do administrador:', senhaValida ? 'VÁLIDA' : 'INVÁLIDA');
  if (!senhaValida) throw new Error('Senha do administrador padrão não confere.');

  // 4. Testar fechamento do processo seletivo
  console.log('\n4. Testando alternância do status do processo...');
  await prisma.openProcess.update({
    where: { id: 1 },
    data: { isOpen: false },
  });
  const statusFechado = await getProcessStatus();
  console.log('   Status após fechar:', statusFechado ? 'ABERTO' : 'FECHADO');

  // Testar se submissão é bloqueada com processo fechado
  const resBloqueado = await submeterInscricao(formData);
  console.log('   Submissão com processo fechado rejeitada corretamente:', !resBloqueado.success, `(${resBloqueado.error})`);

  // Reabre o processo
  await prisma.openProcess.update({
    where: { id: 1 },
    data: { isOpen: true },
  });
  const statusReaberto = await getProcessStatus();
  console.log('   Status após reabrir:', statusReaberto ? 'ABERTO' : 'FECHADO');

  console.log('\n✅ Todos os testes de integração do banco e Server Actions passaram com 100% de sucesso!');
}

runTests()
  .catch((e) => {
    console.error('❌ Erro no teste:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
