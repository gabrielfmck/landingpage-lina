'use server';

import fs from 'node:fs/promises';
import path from 'node:path';
import { prisma } from '@/lib/prisma';
import { getProcessStatus } from '@/lib/actions/process';

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB

export interface InscricaoResponse {
  success: boolean;
  error?: string;
  candidato?: {
    id: number;
    nome: string;
    matricula: string;
    email: string;
    telefone: string;
    curso: string;
    periodo: string;
    areaAtuacao: string;
    temHistorico: boolean;
    temCertificados: boolean;
    dataEnvio: string;
  };
}

export async function submeterInscricao(formData: FormData): Promise<InscricaoResponse> {
  const isOpen = await getProcessStatus();
  if (!isOpen) {
    return {
      success: false,
      error: 'As inscrições para o processo seletivo não estão disponíveis no momento.',
    };
  }

  const nome = (formData.get('nome') as string)?.trim();
  const matricula = (formData.get('matricula') as string)?.trim();
  const email = (formData.get('email') as string)?.trim().toLowerCase();
  const telefone = (formData.get('telefone') as string)?.trim();
  const curso = (formData.get('curso') as string)?.trim();
  const periodo = (formData.get('periodo') as string)?.trim();
  const areasAtuacao = formData.getAll('areaAtuacao') as string[];

  if (!nome || !matricula || !email || !telefone || !curso || !periodo || areasAtuacao.length === 0) {
    return {
      success: false,
      error: 'Por favor, preencha todos os campos obrigatórios e selecione ao menos uma área de atuação.',
    };
  }

  // Validação dos arquivos opcionais
  const historicoFile = formData.get('historico') as File | null;
  const certificadosFile = formData.get('certificados') as File | null;

  if (historicoFile && historicoFile.size > 0) {
    if (historicoFile.size > MAX_FILE_SIZE) {
      return { success: false, error: 'O arquivo de histórico escolar excede o limite de 20MB.' };
    }
    if (historicoFile.type !== 'application/pdf' && !historicoFile.name.toLowerCase().endsWith('.pdf')) {
      return { success: false, error: 'O histórico escolar deve ser enviado exclusivamente em formato PDF.' };
    }
  }

  if (certificadosFile && certificadosFile.size > 0) {
    if (certificadosFile.size > MAX_FILE_SIZE) {
      return { success: false, error: 'O arquivo de certificados excede o limite de 20MB.' };
    }
    if (certificadosFile.type !== 'application/pdf' && !certificadosFile.name.toLowerCase().endsWith('.pdf')) {
      return { success: false, error: 'Os certificados devem ser enviados exclusivamente em formato PDF único.' };
    }
  }

  try {
    // 1. Cria o registro no banco com os dados textuais para obter o ID único
    const candidato = await prisma.candidato.create({
      data: {
        nome,
        matricula,
        email,
        telefone,
        curso,
        periodo,
        areaAtuacao: areasAtuacao.join(', '),
      },
    });

    const uploadsDir = path.join(process.cwd(), 'uploads');
    await fs.mkdir(uploadsDir, { recursive: true });

    let historicoUrl: string | null = null;
    let certificadosUrl: string | null = null;

    // 2. Salva os arquivos com nomes determinísticos baseados no candidato.id para evitar colisões
    if (historicoFile && historicoFile.size > 0) {
      const fileName = `historico_candidato_${candidato.id}.pdf`;
      const buffer = Buffer.from(await historicoFile.arrayBuffer());
      await fs.writeFile(path.join(uploadsDir, fileName), buffer);
      historicoUrl = fileName;
    }

    if (certificadosFile && certificadosFile.size > 0) {
      const fileName = `certificados_candidato_${candidato.id}.pdf`;
      const buffer = Buffer.from(await certificadosFile.arrayBuffer());
      await fs.writeFile(path.join(uploadsDir, fileName), buffer);
      certificadosUrl = fileName;
    }

    // 3. Atualiza os links dos arquivos no registro do candidato se houverem
    if (historicoUrl || certificadosUrl) {
      await prisma.candidato.update({
        where: { id: candidato.id },
        data: {
          historicoUrl,
          certificadosUrl,
        },
      });
    }

    return {
      success: true,
      candidato: {
        id: candidato.id,
        nome: candidato.nome,
        matricula: candidato.matricula,
        email: candidato.email,
        telefone: candidato.telefone,
        curso: candidato.curso,
        periodo: candidato.periodo,
        areaAtuacao: candidato.areaAtuacao,
        temHistorico: !!historicoUrl,
        temCertificados: !!certificadosUrl,
        dataEnvio: new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
      },
    };
  } catch (error) {
    console.error('Erro ao registrar candidatura:', error);
    return {
      success: false,
      error: 'Ocorreu um erro interno ao processar a inscrição. Por favor, tente novamente.',
    };
  }
}
