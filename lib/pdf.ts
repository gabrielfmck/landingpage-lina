import { jsPDF } from 'jspdf';

export interface CandidatoComprovante {
  id: number;
  nome: string;
  matricula: string;
  email: string;
  telefone: string;
  curso: string;
  periodo: string;
  campus?: string;
  areaAtuacao: string;
  temHistorico: boolean;
  temCertificados: boolean;
  dataEnvio: string;
}

export function gerarComprovantePDF(candidato: CandidatoComprovante) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const protocolo = `LINA-2026-${String(candidato.id).padStart(5, '0')}`;

  // Cores institucionais LINA
  const corPrimaria: [number, number, number] = [6, 12, 134]; // #060c86 (lina-deep)
  const corSecundaria: [number, number, number] = [0, 0, 230]; // #0000e6 (lina-electric)
  const corTexto: [number, number, number] = [10, 16, 51]; // #0a1033 (lina-ink)
  const corMuted: [number, number, number] = [45, 45, 145]; // #2d2d91 (lina-slate)
  const corLinha: [number, number, number] = [230, 232, 248];

  // Barra decorativa superior
  doc.setFillColor(corPrimaria[0], corPrimaria[1], corPrimaria[2]);
  doc.rect(0, 0, 210, 8, 'F');

  // Cabeçalho Institucional
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(corPrimaria[0], corPrimaria[1], corPrimaria[2]);
  doc.text('LINA · Liga Acadêmica de Robótica e IA', 20, 24);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(corMuted[0], corMuted[1], corMuted[2]);
  doc.text('Faculdade de Computação · Universidade Federal de Uberlândia (FACOM/UFU)', 20, 30);

  // Linha divisória
  doc.setDrawColor(corLinha[0], corLinha[1], corLinha[2]);
  doc.setLineWidth(0.5);
  doc.line(20, 35, 190, 35);

  // Título do documento
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(corPrimaria[0], corPrimaria[1], corPrimaria[2]);
  doc.text('COMPROVANTE DE INSCRIÇÃO · EDITAL 01/2026', 20, 45);

  // Caixa de Protocolo
  doc.setFillColor(242, 243, 251); // #f2f3fb (lina-mist)
  doc.roundedRect(20, 50, 170, 18, 3, 3, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(corSecundaria[0], corSecundaria[1], corSecundaria[2]);
  doc.text(`NÚMERO DE PROTOCOLO: ${protocolo}`, 25, 58);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(corTexto[0], corTexto[1], corTexto[2]);
  doc.text(`Data e hora de recebimento: ${candidato.dataEnvio}`, 25, 64);

  // Dados do Candidato
  let y = 78;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(corPrimaria[0], corPrimaria[1], corPrimaria[2]);
  doc.text('1. DADOS CADASTRAIS DO CANDIDATO', 20, y);

  y += 6;
  doc.setDrawColor(corLinha[0], corLinha[1], corLinha[2]);
  doc.line(20, y, 190, y);

  const campos = [
    { rotulo: 'Nome Completo:', valor: candidato.nome },
    { rotulo: 'Matrícula UFU:', valor: candidato.matricula },
    { rotulo: 'E-mail:', valor: candidato.email },
    { rotulo: 'Telefone de Contato:', valor: candidato.telefone },
    { rotulo: 'Curso de Graduação:', valor: candidato.curso },
    { rotulo: 'Campus:', valor: candidato.campus || 'Campus Uberlândia (Umuarama, Santa Mônica, Educação Física, Glória)' },
    { rotulo: 'Período Cursado:', valor: candidato.periodo },
    { rotulo: 'Área(s) de Atuação:', valor: candidato.areaAtuacao },
  ];

  y += 6;
  doc.setFontSize(10);
  for (const campo of campos) {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(corMuted[0], corMuted[1], corMuted[2]);
    doc.text(campo.rotulo, 22, y);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(corTexto[0], corTexto[1], corTexto[2]);
    doc.text(campo.valor, 75, y);

    y += 8;
  }

  // Documentos Anexados
  y += 4;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(corPrimaria[0], corPrimaria[1], corPrimaria[2]);
  doc.text('2. DOCUMENTAÇÃO DECLARADA', 20, y);

  y += 6;
  doc.setDrawColor(corLinha[0], corLinha[1], corLinha[2]);
  doc.line(20, y, 190, y);

  y += 8;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(corMuted[0], corMuted[1], corMuted[2]);
  doc.text('Histórico Escolar:', 22, y);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(corTexto[0], corTexto[1], corTexto[2]);
  doc.text(candidato.temHistorico ? 'Arquivo PDF anexado' : 'Não anexado (opcional)', 75, y);

  y += 8;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(corMuted[0], corMuted[1], corMuted[2]);
  doc.text('Certificados:', 22, y);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(corTexto[0], corTexto[1], corTexto[2]);
  doc.text(candidato.temCertificados ? 'Arquivo PDF anexado' : 'Não anexado (opcional)', 75, y);

  // Orientações Importantes
  y += 16;
  doc.setFillColor(242, 243, 251);
  doc.roundedRect(20, y, 170, 32, 3, 3, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(corPrimaria[0], corPrimaria[1], corPrimaria[2]);
  doc.text('INFORMAÇÕES E PRÓXIMAS ETAPAS', 25, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(corTexto[0], corTexto[1], corTexto[2]);
  doc.text(
    'Guarde este comprovante e seu protocolo. Acompanhe a divulgação da prova classificatória',
    25,
    y + 15
  );
  doc.text(
    'e resultado conforme o cronograma oficial do Edital 01/2026.',
    25,
    y + 20
  );
  doc.text(
    'Dúvidas sobre o processo seletivo: lina@facom.ufu.br',
    25,
    y + 26
  );

  // Rodapé
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 170);
  doc.text(
    'Este documento é emitido eletronicamente pelo Sistema de Seleção LINA/FACOM/UFU.',
    20,
    285
  );

  // Salvar / Download
  doc.save(`Comprovante_Inscricao_${protocolo}.pdf`);
}
