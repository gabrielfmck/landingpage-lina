'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  Download,
  AlertCircle,
  ArrowLeft,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Cell } from '@/components/primitives/Cell';
import { BracketLabel } from '@/components/primitives/BracketLabel';
import { submeterInscricao, type InscricaoResponse } from '@/lib/actions/inscricao';
import { gerarComprovantePDF, type CandidatoComprovante } from '@/lib/pdf';

const CURSOS_SUGERIDOS = [
  'Ciência da Computação (BCC)',
  'Sistemas de Informação (BSI)',
  'Engenharia de Computação (BCO)',
  'Inteligência Artificial (BIA)',
  'Outro curso da UFU',
];

const PERIODOS = [
  '1º Período',
  '2º Período',
  '3º Período',
  '4º Período',
  '5º Período',
  '6º Período',
  '7º Período',
  '8º Período',
  '9º Período',
  '10º Período ou superior',
];

const CAMPUS_OPTIONS = [
  'Campus Uberlândia (Umuarama, Santa Mônica, Educação Física, Glória)',
  'Campus Pontal',
  'Campus Monte Carmelo',
  'Campus Patos de Minas',
];

const AREAS_ATUACAO = [
  { id: 'Robótica', label: 'Robótica', desc: 'Hardware, sistemas embarcados, ROS e mecânica' },
  { id: 'IA', label: 'IA (Inteligência Artificial)', desc: 'Machine Learning, Visão Computacional e NLP' },
  { id: 'Marketing', label: 'Marketing', desc: 'Design, comunicação, mídias sociais e eventos' },
];

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB por arquivo

export function FormularioInscricao() {
  const [isPending, startTransition] = useTransition();
  const [erro, setErro] = useState<string | null>(null);
  const [sucessoData, setSucessoData] = useState<CandidatoComprovante | null>(null);

  // Estados dos arquivos selecionados para preview de nome e tamanho
  const [historicoNome, setHistoricoNome] = useState<string | null>(null);
  const [certificadosNome, setCertificadosNome] = useState<string | null>(null);

  // Áreas de atuação selecionadas
  const [areasSelecionadas, setAreasSelecionadas] = useState<string[]>([]);

  function toggleArea(area: string) {
    setAreasSelecionadas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  }

  function handleFileChange(
    e: React.ChangeEvent<HTMLInputElement>,
    setFileName: (val: string | null) => void,
    rotuloDoc: string
  ) {
    setErro(null);
    const file = e.target.files?.[0];
    if (!file) {
      setFileName(null);
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      const tamanhoMB = (file.size / (1024 * 1024)).toFixed(1);
      setErro(
        `O arquivo de ${rotuloDoc} possui ${tamanhoMB}MB e excede o limite máximo permitido de 20MB. Por favor, reduza ou compacte o documento antes de anexar.`
      );
      e.target.value = '';
      setFileName(null);
      return;
    }

    setFileName(`${file.name} (${(file.size / (1024 * 1024)).toFixed(1)} MB)`);
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErro(null);

    if (areasSelecionadas.length === 0) {
      setErro('Por favor, selecione ao menos uma área principal de atuação.');
      return;
    }

    const formElement = event.currentTarget;
    const formData = new FormData(formElement);

    const historico = formData.get('historico') as File | null;
    const certificados = formData.get('certificados') as File | null;

    if (historico && historico.size > MAX_FILE_SIZE) {
      setErro('O arquivo de histórico escolar excede o limite máximo permitido de 20MB.');
      return;
    }

    if (certificados && certificados.size > MAX_FILE_SIZE) {
      setErro('O arquivo de certificados excede o limite máximo permitido de 20MB.');
      return;
    }

    // Adiciona as áreas selecionadas
    formData.delete('areaAtuacao');
    for (const area of areasSelecionadas) {
      formData.append('areaAtuacao', area);
    }

    startTransition(async () => {
      const res: InscricaoResponse = await submeterInscricao(formData);
      if (!res.success || !res.candidato) {
        setErro(res.error || 'Erro ao processar inscrição. Tente novamente.');
      } else {
        setSucessoData(res.candidato);
        // Rola até o topo da tela
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  // TELA DE CONFIRMAÇÃO E DOWNLOAD DO COMPROVANTE
  if (sucessoData) {
    const protocolo = `LINA-2026-${String(sucessoData.id).padStart(5, '0')}`;

    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <Cell surface="paper" padding="lg" radius="lg" className="border border-lina-mist shadow-md">
          <div className="flex items-center gap-3 text-lina-royal">
            <CheckCircle2 className="size-8 text-emerald-600" aria-hidden="true" />
            <BracketLabel>[ INSCRIÇÃO RECEBIDA ]</BracketLabel>
          </div>

          <h1 className="mt-4 font-display text-2xl font-bold text-lina-deep sm:text-3xl">
            Inscrição realizada com sucesso!
          </h1>

          <p className="mt-2 text-base text-lina-ink">
            Sua candidatura para o Edital 01/2026 da LINA foi registrada no sistema.
          </p>

          <div className="mt-6 rounded-lg border border-lina-mist bg-lina-mist/60 p-5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-lina-slate/15 pb-4">
              <div>
                <span className="text-xs font-semibold tracking-wider text-lina-slate uppercase">
                  Número de Protocolo
                </span>
                <p className="font-mono text-xl font-bold text-lina-deep">{protocolo}</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold tracking-wider text-lina-slate uppercase">
                  Data de Envio
                </span>
                <p className="text-sm font-medium text-lina-ink">{sucessoData.dataEnvio}</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 text-sm">
              <div>
                <span className="text-lina-slate">Nome:</span>{' '}
                <span className="font-semibold text-lina-ink">{sucessoData.nome}</span>
              </div>
              <div>
                <span className="text-lina-slate">Matrícula:</span>{' '}
                <span className="font-mono font-semibold text-lina-ink">{sucessoData.matricula}</span>
              </div>
              <div>
                <span className="text-lina-slate">Curso:</span>{' '}
                <span className="font-medium text-lina-ink">{sucessoData.curso}</span>
              </div>
              <div>
                <span className="text-lina-slate">Período:</span>{' '}
                <span className="font-medium text-lina-ink">{sucessoData.periodo}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-lina-slate">Campus:</span>{' '}
                <span className="font-medium text-lina-ink">{sucessoData.campus}</span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-lina-slate">Área(s):</span>{' '}
                <span className="font-semibold text-lina-deep">{sucessoData.areaAtuacao}</span>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Button
              type="button"
              size="lg"
              variant="solid"
              onClick={() => gerarComprovantePDF(sucessoData)}
              className="flex items-center justify-center gap-2 shadow-sm"
            >
              <Download className="size-5" aria-hidden="true" />
              Baixar Comprovante (PDF)
            </Button>

            <Button asChild variant="outline" size="lg">
              <Link href="/" className="inline-flex items-center gap-2">
                <ArrowLeft className="size-4" aria-hidden="true" />
                Voltar à Página Inicial
              </Link>
            </Button>
          </div>

          <div className="mt-8 border-t border-lina-mist pt-4 text-xs text-lina-slate">
            <p>
              * Guarde o comprovante em PDF e o número de protocolo. Todas as convocações e etapas
              seguirão o cronograma do Edital 01/2026.
            </p>
          </div>
        </Cell>
      </div>
    );
  }

  // FORMULÁRIO DE INSCRIÇÃO
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <Cell surface="paper" padding="lg" radius="lg" className="border border-lina-mist shadow-sm">
        <div className="flex items-center gap-2 text-lina-royal">
          <FileText className="size-5 text-lina-electric" aria-hidden="true" />
          <BracketLabel>[ FORMULÁRIO DE INSCRIÇÃO ]</BracketLabel>
        </div>

        <h1 className="mt-3 font-display text-2xl font-bold text-lina-deep sm:text-3xl">
          Processo Seletivo LINA · Ciclo 2026-02
        </h1>

        <p className="mt-2 text-sm leading-relaxed text-lina-ink sm:text-base">
          Preencha com atenção seus dados acadêmicos e anexe a documentação necessária. A inscrição é
          gratuita e regida pelo Edital 01/2026.
        </p>

        <div className="mt-4">
          <Button asChild variant="outline" size="sm">
            <a
              href="/edital.pdf"
              target="_blank"
              rel="noopener noreferrer"
              download="Edital_01_2026_LINA.pdf"
              className="inline-flex items-center gap-2"
            >
              <Download className="size-4" aria-hidden="true" />
              Fazer download do edital
            </a>
          </Button>
        </div>

        {erro && (
          <div
            role="alert"
            className="mt-6 flex items-start gap-3 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900"
          >
            <AlertCircle className="size-5 shrink-0 text-rose-600" aria-hidden="true" />
            <div>
              <p className="font-semibold">Não foi possível enviar sua inscrição</p>
              <p className="mt-0.5">{erro}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* Informações Pessoais */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="nome" className="block text-sm font-semibold text-lina-deep">
                Nome completo <span className="text-lina-electric">*</span>
              </label>
              <input
                id="nome"
                name="nome"
                type="text"
                required
                placeholder="Seu nome completo"
                className="mt-1.5 block w-full rounded-md border border-lina-slate/30 bg-lina-paper px-3.5 py-2 text-sm text-lina-ink shadow-xs outline-none transition-all placeholder:text-lina-slate/50 focus:border-lina-electric focus:ring-2 focus:ring-lina-electric/20"
              />
            </div>

            <div>
              <label htmlFor="matricula" className="block text-sm font-semibold text-lina-deep">
                Matrícula UFU <span className="text-lina-electric">*</span>
              </label>
              <input
                id="matricula"
                name="matricula"
                type="text"
                required
                placeholder="Ex: 12345BSI001"
                className="mt-1.5 block w-full rounded-md border border-lina-slate/30 bg-lina-paper px-3.5 py-2 text-sm font-mono text-lina-ink shadow-xs outline-none transition-all placeholder:text-lina-slate/50 focus:border-lina-electric focus:ring-2 focus:ring-lina-electric/20"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-lina-deep">
                E-mail institucional / principal <span className="text-lina-electric">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="exemplo@ufu.br"
                className="mt-1.5 block w-full rounded-md border border-lina-slate/30 bg-lina-paper px-3.5 py-2 text-sm text-lina-ink shadow-xs outline-none transition-all placeholder:text-lina-slate/50 focus:border-lina-electric focus:ring-2 focus:ring-lina-electric/20"
              />
            </div>

            <div>
              <label htmlFor="telefone" className="block text-sm font-semibold text-lina-deep">
                Telefone de Contato (WhatsApp) <span className="text-lina-electric">*</span>
              </label>
              <input
                id="telefone"
                name="telefone"
                type="tel"
                required
                placeholder="(34) 99999-9999"
                className="mt-1.5 block w-full rounded-md border border-lina-slate/30 bg-lina-paper px-3.5 py-2 text-sm text-lina-ink shadow-xs outline-none transition-all placeholder:text-lina-slate/50 focus:border-lina-electric focus:ring-2 focus:ring-lina-electric/20"
              />
            </div>

            <div>
              <label htmlFor="curso" className="block text-sm font-semibold text-lina-deep">
                Curso de Graduação <span className="text-lina-electric">*</span>
              </label>
              <select
                id="curso"
                name="curso"
                required
                defaultValue=""
                className="mt-1.5 block w-full rounded-md border border-lina-slate/30 bg-lina-paper px-3.5 py-2 text-sm text-lina-ink shadow-xs outline-none transition-all focus:border-lina-electric focus:ring-2 focus:ring-lina-electric/20"
              >
                <option value="" disabled>
                  Selecione seu curso
                </option>
                {CURSOS_SUGERIDOS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="periodo" className="block text-sm font-semibold text-lina-deep">
                Período cursado no semestre atual <span className="text-lina-electric">*</span>
              </label>
              <select
                id="periodo"
                name="periodo"
                required
                defaultValue=""
                className="mt-1.5 block w-full rounded-md border border-lina-slate/30 bg-lina-paper px-3.5 py-2 text-sm text-lina-ink shadow-xs outline-none transition-all focus:border-lina-electric focus:ring-2 focus:ring-lina-electric/20"
              >
                <option value="" disabled>
                  Selecione o período
                </option>
                {PERIODOS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="campus" className="block text-sm font-semibold text-lina-deep">
                Campus <span className="text-lina-electric">*</span>
              </label>
              <select
                id="campus"
                name="campus"
                required
                defaultValue=""
                className="mt-1.5 block w-full rounded-md border border-lina-slate/30 bg-lina-paper px-3.5 py-2 text-sm text-lina-ink shadow-xs outline-none transition-all focus:border-lina-electric focus:ring-2 focus:ring-lina-electric/20"
              >
                <option value="" disabled>
                  Selecione o campus
                </option>
                {CAMPUS_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Área Principal de Atuação (Checkbox) */}
          <div className="border-t border-lina-mist pt-6">
            <fieldset>
              <legend className="text-sm font-semibold text-lina-deep">
                Área principal de atuação <span className="text-lina-electric">*</span>
              </legend>
              <p className="mt-1 text-xs text-lina-slate">
                Você pode selecionar uma ou mais áreas que mais combinam com seus interesses e perfil.
              </p>

              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {AREAS_ATUACAO.map((area) => {
                  const isChecked = areasSelecionadas.includes(area.id);
                  return (
                    <label
                      key={area.id}
                      className={`relative flex cursor-pointer flex-col justify-between rounded-lg border p-4 transition-all ${
                        isChecked
                          ? 'border-lina-electric bg-lina-mist/60 shadow-xs'
                          : 'border-lina-slate/20 bg-lina-paper hover:border-lina-slate/40'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <span className="font-semibold text-lina-deep text-sm">{area.label}</span>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleArea(area.id)}
                          className="size-4.5 rounded text-lina-electric focus:ring-lina-electric"
                        />
                      </div>
                      <p className="mt-2 text-xs text-lina-slate">{area.desc}</p>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          </div>

          {/* Upload de Documentos */}
          <div className="border-t border-lina-mist pt-6 space-y-6">
            <h2 className="text-base font-semibold text-lina-deep">Documentação Acadêmica</h2>

            {/* Histórico Escolar */}
            <div>
              <label htmlFor="historico" className="block text-sm font-semibold text-lina-deep">
                Histórico Escolar (PDF) <span className="text-xs font-normal text-lina-slate">(opcional)</span>
              </label>
              <p className="mt-0.5 text-xs text-lina-slate">
                Emissão recente obtida via Portal UFU. Limite máximo: 20MB.
              </p>
              <div className="mt-2 flex items-center gap-3">
                <input
                  id="historico"
                  name="historico"
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => handleFileChange(e, setHistoricoNome, 'Histórico Escolar')}
                  className="block w-full text-xs text-lina-slate file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-lina-mist file:px-3 file:py-2 file:text-xs file:font-semibold file:text-lina-deep hover:file:bg-lina-slate/15"
                />
              </div>
              {historicoNome && (
                <p className="mt-1 text-xs text-emerald-700 font-medium">Arquivo selecionado: {historicoNome}</p>
              )}
            </div>

            {/* Certificados */}
            <div>
              <label htmlFor="certificados" className="block text-sm font-semibold text-lina-deep">
                Certificados (PDF único) <span className="text-xs font-normal text-lina-slate">(opcional)</span>
              </label>
              <p className="mt-0.5 text-xs font-medium text-lina-electric">
                Adicione apenas um arquivo, com todos os certificados válidos que deseja anexar (limite máximo de 20MB).
              </p>
              <div className="mt-2 flex items-center gap-3">
                <input
                  id="certificados"
                  name="certificados"
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => handleFileChange(e, setCertificadosNome, 'Certificados')}
                  className="block w-full text-xs text-lina-slate file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-lina-mist file:px-3 file:py-2 file:text-xs file:font-semibold file:text-lina-deep hover:file:bg-lina-slate/15"
                />
              </div>
              {certificadosNome && (
                <p className="mt-1 text-xs text-emerald-700 font-medium">Arquivo selecionado: {certificadosNome}</p>
              )}
            </div>
          </div>

          {/* Botão de Envio */}
          <div className="border-t border-lina-mist pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-lina-slate">
              Ao enviar, você declara que as informações são verídicas e concorda com as normas do Edital 01/2026.
            </p>

            <Button
              type="submit"
              size="lg"
              variant="solid"
              disabled={isPending}
              className="w-full sm:w-auto min-w-[200px]"
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  Processando inscrição...
                </>
              ) : (
                <>
                  <UploadCloud className="size-4" aria-hidden="true" />
                  Enviar Inscrição
                </>
              )}
            </Button>
          </div>
        </form>
      </Cell>
    </div>
  );
}
