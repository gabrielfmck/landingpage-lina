'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import {
  Users,
  Search,
  Download,
  FileText,
  Award,
  ChevronDown,
  ChevronUp,
  Power,
  Shield,
  Trash2,
  UserPlus,
  Loader2,
  ExternalLink,
  AlertCircle,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Cell } from '@/components/primitives/Cell';
import { BrandAsset } from '@/components/primitives/BrandAsset';
import { toggleProcessStatus } from '@/lib/actions/process';
import { logoutAction } from '@/lib/actions/auth';
import {
  getCandidateDocumentBase64,
  createAdminUser,
  deleteAdminUser,
} from '@/lib/actions/admin';

interface Candidato {
  id: number;
  nome: string;
  matricula: string;
  email: string;
  telefone: string;
  curso: string;
  periodo: string;
  areaAtuacao: string;
  historicoUrl: string | null;
  certificadosUrl: string | null;
  createdAt: Date | string;
}

interface AdminUser {
  id: number;
  email: string;
  nome: string;
  createdAt: Date | string;
}

interface Stats {
  total: number;
  robotica: number;
  ia: number;
  marketing: number;
  comHistorico: number;
  comCertificados: number;
  isOpen: boolean;
  totalAdmins: number;
}

interface DashboardClientProps {
  initialCandidatos: Candidato[];
  initialStats: Stats;
  initialAdmins: AdminUser[];
  currentUserName: string;
}

export function DashboardClient({
  initialCandidatos,
  initialStats,
  initialAdmins,
  currentUserName,
}: DashboardClientProps) {
  const [candidatos] = useState<Candidato[]>(initialCandidatos);
  const [stats, setStats] = useState<Stats>(initialStats);
  const [admins, setAdmins] = useState<AdminUser[]>(initialAdmins);

  const [busca, setBusca] = useState('');
  const [filtroArea, setFiltroArea] = useState<string>('todos');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const [isTogglingProcess, startToggleProcess] = useTransition();
  const [downloadingDoc, setDownloadingDoc] = useState<string | null>(null);

  // Controle da aba de Administradores
  const [abaAtiva, setAbaAtiva] = useState<'candidatos' | 'admins'>('candidatos');
  const [adminNovoNome, setAdminNovoNome] = useState('');
  const [adminNovoEmail, setAdminNovoEmail] = useState('');
  const [adminNovaSenha, setAdminNovaSenha] = useState('');
  const [erroAdmin, setErroAdmin] = useState<string | null>(null);
  const [isPendingAdmin, startAdminTransition] = useTransition();

  function toggleExpand(id: number) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  function handleToggleProcesso() {
    startToggleProcess(async () => {
      const novoStatus = !stats.isOpen;
      const res = await toggleProcessStatus(novoStatus);
      if (res.success) {
        setStats((prev) => ({ ...prev, isOpen: novoStatus }));
      }
    });
  }

  async function handleDownloadDoc(candidatoId: number, tipo: 'historico' | 'certificados') {
    const docKey = `${candidatoId}-${tipo}`;
    setDownloadingDoc(docKey);
    try {
      const res = await getCandidateDocumentBase64(candidatoId, tipo);
      if (res.success && res.base64 && res.fileName) {
        // Converte base64 para blob e inicia download
        const byteCharacters = atob(res.base64);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = res.fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        alert(res.error || 'Erro ao carregar documento.');
      }
    } catch {
      alert('Falha ao baixar documento.');
    } finally {
      setDownloadingDoc(null);
    }
  }

  function handleExportCSV() {
    const headers = ['ID', 'Nome', 'Matrícula', 'E-mail', 'Telefone', 'Curso', 'Período', 'Áreas', 'Histórico', 'Certificados', 'Data'];
    const rows = candidatos.map((c) => [
      c.id,
      `"${c.nome.replace(/"/g, '""')}"`,
      `"${c.matricula}"`,
      `"${c.email}"`,
      `"${c.telefone}"`,
      `"${c.curso}"`,
      `"${c.periodo}"`,
      `"${c.areaAtuacao}"`,
      c.historicoUrl ? 'Sim' : 'Não',
      c.certificadosUrl ? 'Sim' : 'Não',
      `"${new Date(c.createdAt).toLocaleString('pt-BR')}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Inscricoes_LINA_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function handleCreateAdmin(e: React.FormEvent) {
    e.preventDefault();
    setErroAdmin(null);

    const formData = new FormData();
    formData.append('nome', adminNovoNome);
    formData.append('email', adminNovoEmail);
    formData.append('senha', adminNovaSenha);

    startAdminTransition(async () => {
      const res = await createAdminUser(formData);
      if (!res.success) {
        setErroAdmin(res.error || 'Erro ao criar administrador.');
      } else {
        setAdminNovoNome('');
        setAdminNovoEmail('');
        setAdminNovaSenha('');
        window.location.reload();
      }
    });
  }

  function handleDeleteAdmin(id: number) {
    if (!confirm('Tem certeza que deseja remover este administrador?')) return;

    startAdminTransition(async () => {
      const res = await deleteAdminUser(id);
      if (!res.success) {
        alert(res.error);
      } else {
        setAdmins((prev) => prev.filter((a) => a.id !== id));
      }
    });
  }

  // Filtragem dos candidatos
  const candidatosFiltrados = candidatos.filter((c) => {
    const termo = busca.toLowerCase();
    const matchBusca =
      c.nome.toLowerCase().includes(termo) ||
      c.matricula.toLowerCase().includes(termo) ||
      c.email.toLowerCase().includes(termo) ||
      c.curso.toLowerCase().includes(termo);

    const matchArea =
      filtroArea === 'todos' ? true : c.areaAtuacao.toLowerCase().includes(filtroArea.toLowerCase());

    return matchBusca && matchArea;
  });

  return (
    <div className="min-h-screen bg-lina-mist/40 pt-header pb-20">
      {/* Top Header do Dashboard */}
      <div className="border-b border-lina-slate/15 bg-lina-paper">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-3">
            <Link href="/" aria-label="LINA Início">
              <BrandAsset variant="lockup-horizontal-reduzido" alt="LINA" className="w-32" />
            </Link>
            <span className="hidden h-5 w-px bg-lina-slate/20 sm:block" />
            <span className="text-sm font-semibold text-lina-deep">
              Painel do Processo Seletivo
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-lina-slate sm:inline">
              Olá, <strong className="text-lina-deep">{currentUserName}</strong>
            </span>

            <form action={logoutAction}>
              <Button type="submit" variant="ghost" size="sm" className="flex items-center gap-1.5 text-xs">
                <LogOut className="size-3.5" aria-hidden="true" />
                Sair
              </Button>
            </form>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* Banner de Controle de Status do Processo Seletivo */}
        <Cell
          surface="paper"
          padding="md"
          radius="md"
          className="mb-8 border border-lina-mist shadow-xs flex flex-wrap items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div
              className={`flex size-10 items-center justify-center rounded-full ${
                stats.isOpen ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
              }`}
            >
              <Power className="size-5" aria-hidden="true" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold tracking-wider uppercase text-lina-slate">
                  Status do Processo Seletivo
                </span>
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                    stats.isOpen
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  {stats.isOpen ? 'Inscrições Abertas' : 'Inscrições Fechadas'}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-lina-slate">
                {stats.isOpen
                  ? 'Candidatos podem acessar /processoseletivo e submeter respostas normalmente.'
                  : 'O acesso à página de inscrição exibe aviso de indisponibilidade e contato.'}
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant={stats.isOpen ? 'outline' : 'solid'}
            size="default"
            disabled={isTogglingProcess}
            onClick={handleToggleProcesso}
            className="flex items-center gap-2"
          >
            {isTogglingProcess && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
            {stats.isOpen ? 'Fechar Inscrições' : 'Abrir Inscrições'}
          </Button>
        </Cell>

        {/* Resumo Estatístico */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Cell surface="paper" padding="sm" radius="md" className="border border-lina-mist shadow-xs">
            <span className="text-xs font-semibold text-lina-slate uppercase tracking-wider">Total de Inscritos</span>
            <p className="mt-2 font-display text-3xl font-bold text-lina-deep">{stats.total}</p>
          </Cell>

          <Cell surface="paper" padding="sm" radius="md" className="border border-lina-mist shadow-xs">
            <span className="text-xs font-semibold text-lina-r-text uppercase tracking-wider">Área Robótica</span>
            <p className="mt-2 font-display text-3xl font-bold text-lina-r">{stats.robotica}</p>
          </Cell>

          <Cell surface="paper" padding="sm" radius="md" className="border border-lina-mist shadow-xs">
            <span className="text-xs font-semibold text-lina-ia-text uppercase tracking-wider">Área IA</span>
            <p className="mt-2 font-display text-3xl font-bold text-lina-ia">{stats.ia}</p>
          </Cell>

          <Cell surface="paper" padding="sm" radius="md" className="border border-lina-mist shadow-xs">
            <span className="text-xs font-semibold text-lina-ml-text uppercase tracking-wider">Área Marketing</span>
            <p className="mt-2 font-display text-3xl font-bold text-lina-ml">{stats.marketing}</p>
          </Cell>
        </div>

        {/* Navegação entre Abas: Candidatos vs Administradores */}
        <div className="mb-6 flex border-b border-lina-slate/15">
          <button
            type="button"
            onClick={() => setAbaAtiva('candidatos')}
            className={`flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-semibold transition-colors ${
              abaAtiva === 'candidatos'
                ? 'border-lina-electric text-lina-deep'
                : 'border-transparent text-lina-slate hover:text-lina-deep'
            }`}
          >
            <Users className="size-4" aria-hidden="true" />
            Candidatos ({candidatos.length})
          </button>

          <button
            type="button"
            onClick={() => setAbaAtiva('admins')}
            className={`flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-semibold transition-colors ${
              abaAtiva === 'admins'
                ? 'border-lina-electric text-lina-deep'
                : 'border-transparent text-lina-slate hover:text-lina-deep'
            }`}
          >
            <Shield className="size-4" aria-hidden="true" />
            Usuários Administradores ({admins.length}/5)
          </button>
        </div>

        {/* ABA 1: LISTA DE CANDIDATOS */}
        {abaAtiva === 'candidatos' && (
          <div>
            {/* Barra de Filtros e Busca */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-1 flex-wrap items-center gap-3">
                <div className="relative min-w-[240px] max-w-md flex-1">
                  <Search className="pointer-events-none absolute inset-y-0 left-3 my-auto size-4 text-lina-slate/60" />
                  <input
                    type="text"
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    placeholder="Buscar por nome, matrícula, curso..."
                    className="block w-full rounded-md border border-lina-slate/30 bg-lina-paper py-2 pr-3 pl-9 text-sm text-lina-ink shadow-xs outline-none transition-all placeholder:text-lina-slate/40 focus:border-lina-electric focus:ring-2 focus:ring-lina-electric/20"
                  />
                </div>

                <select
                  value={filtroArea}
                  onChange={(e) => setFiltroArea(e.target.value)}
                  className="rounded-md border border-lina-slate/30 bg-lina-paper px-3 py-2 text-sm text-lina-ink shadow-xs outline-none focus:border-lina-electric"
                >
                  <option value="todos">Todas as áreas</option>
                  <option value="Robótica">Robótica</option>
                  <option value="IA">Inteligência Artificial</option>
                  <option value="Marketing">Marketing</option>
                </select>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleExportCSV}
                className="flex items-center gap-2 text-xs"
              >
                <Download className="size-3.5" aria-hidden="true" />
                Exportar CSV
              </Button>
            </div>

            {/* Listagem de Candidatos Expansíveis */}
            {candidatosFiltrados.length === 0 ? (
              <Cell surface="paper" padding="lg" radius="md" className="border border-lina-mist text-center">
                <p className="text-sm font-semibold text-lina-deep">Nenhum candidato encontrado</p>
                <p className="mt-1 text-xs text-lina-slate">
                  Tente alterar os termos de busca ou filtros de área.
                </p>
              </Cell>
            ) : (
              <div className="space-y-3">
                {candidatosFiltrados.map((candidato) => {
                  const isExpanded = expandedId === candidato.id;

                  return (
                    <Cell
                      key={candidato.id}
                      surface="paper"
                      padding="none"
                      radius="md"
                      className="border border-lina-mist shadow-xs transition-shadow hover:shadow-sm overflow-hidden"
                    >
                      {/* Linha Resumo - Clicável */}
                      <button
                        type="button"
                        onClick={() => toggleExpand(candidato.id)}
                        className="w-full text-left p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 cursor-pointer hover:bg-lina-mist/30 transition-colors"
                      >
                        <div className="flex-1 min-w-[200px]">
                          <div className="flex items-center gap-2">
                            <span className="font-display font-semibold text-lina-deep text-base">
                              {candidato.nome}
                            </span>
                            <span className="rounded bg-lina-mist px-2 py-0.5 font-mono text-xs font-medium text-lina-slate">
                              {candidato.matricula}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-lina-slate">
                            {candidato.curso} · {candidato.periodo}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex flex-wrap gap-1.5">
                            {candidato.areaAtuacao.split(',').map((area) => (
                              <span
                                key={area.trim()}
                                className="rounded-full bg-lina-electric/10 px-2.5 py-0.5 text-xs font-semibold text-lina-electric"
                              >
                                {area.trim()}
                              </span>
                            ))}
                          </div>

                          <span className="text-xs text-lina-slate whitespace-nowrap hidden md:inline">
                            {new Date(candidato.createdAt).toLocaleDateString('pt-BR')}
                          </span>

                          <div className="text-lina-slate">
                            {isExpanded ? <ChevronUp className="size-5" /> : <ChevronDown className="size-5" />}
                          </div>
                        </div>
                      </button>

                      {/* Painel de Detalhes Expandido */}
                      {isExpanded && (
                        <div className="border-t border-lina-mist bg-lina-mist/30 p-5 sm:p-6 text-sm text-lina-ink">
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <div>
                              <span className="text-xs font-semibold tracking-wider text-lina-slate uppercase">
                                E-mail
                              </span>
                              <p className="mt-1">
                                <a
                                  href={`mailto:${candidato.email}`}
                                  className="font-medium text-lina-electric underline underline-offset-4"
                                >
                                  {candidato.email}
                                </a>
                              </p>
                            </div>

                            <div>
                              <span className="text-xs font-semibold tracking-wider text-lina-slate uppercase">
                                Telefone (WhatsApp)
                              </span>
                              <p className="mt-1">
                                <a
                                  href={`https://wa.me/55${candidato.telefone.replace(/\D/g, '')}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="font-medium text-lina-electric underline underline-offset-4 inline-flex items-center gap-1"
                                >
                                  {candidato.telefone}
                                  <ExternalLink className="size-3" aria-hidden="true" />
                                </a>
                              </p>
                            </div>

                            <div>
                              <span className="text-xs font-semibold tracking-wider text-lina-slate uppercase">
                                Data e Hora de Envio
                              </span>
                              <p className="mt-1 text-lina-ink font-medium">
                                {new Date(candidato.createdAt).toLocaleString('pt-BR')}
                              </p>
                            </div>
                          </div>

                          {/* Seção de Documentos com Botões de Download */}
                          <div className="mt-6 border-t border-lina-slate/15 pt-4">
                            <span className="text-xs font-bold tracking-wider text-lina-deep uppercase">
                              Documentos Anexados
                            </span>

                            <div className="mt-3 flex flex-wrap gap-4">
                              {/* Histórico Escolar */}
                              {candidato.historicoUrl ? (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  disabled={downloadingDoc === `${candidato.id}-historico`}
                                  onClick={() => handleDownloadDoc(candidato.id, 'historico')}
                                  className="flex items-center gap-2 text-xs"
                                >
                                  {downloadingDoc === `${candidato.id}-historico` ? (
                                    <Loader2 className="size-3.5 animate-spin" />
                                  ) : (
                                    <FileText className="size-3.5 text-lina-electric" />
                                  )}
                                  Baixar Histórico Escolar (PDF)
                                </Button>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 rounded-md border border-lina-slate/20 bg-lina-paper px-3 py-1.5 text-xs text-lina-slate">
                                  <FileText className="size-3.5 opacity-40" />
                                  Histórico não anexado
                                </span>
                              )}

                              {/* Certificados */}
                              {candidato.certificadosUrl ? (
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  disabled={downloadingDoc === `${candidato.id}-certificados`}
                                  onClick={() => handleDownloadDoc(candidato.id, 'certificados')}
                                  className="flex items-center gap-2 text-xs"
                                >
                                  {downloadingDoc === `${candidato.id}-certificados` ? (
                                    <Loader2 className="size-3.5 animate-spin" />
                                  ) : (
                                    <Award className="size-3.5 text-lina-r" />
                                  )}
                                  Baixar Certificados (PDF)
                                </Button>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 rounded-md border border-lina-slate/20 bg-lina-paper px-3 py-1.5 text-xs text-lina-slate">
                                  <Award className="size-3.5 opacity-40" />
                                  Certificados não anexados
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </Cell>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ABA 2: GESTÃO DE ADMINISTRADORES (1 A 5 USUÁRIOS) */}
        {abaAtiva === 'admins' && (
          <div className="space-y-6">
            <Cell surface="paper" padding="md" radius="md" className="border border-lina-mist">
              <div className="flex items-center gap-2">
                <Shield className="size-5 text-lina-electric" aria-hidden="true" />
                <h2 className="font-display text-lg font-bold text-lina-deep">
                  Administradores do Sistema ({admins.length}/5)
                </h2>
              </div>
              <p className="mt-1 text-xs text-lina-slate">
                O acesso ao painel é restrito a no máximo 5 usuários da coordenação. Não existe página
                pública de cadastro de usuários.
              </p>

              {/* Lista dos administradores */}
              <div className="mt-5 space-y-2">
                {admins.map((adm) => (
                  <div
                    key={adm.id}
                    className="flex items-center justify-between rounded-lg border border-lina-mist bg-lina-mist/30 p-3.5 text-sm"
                  >
                    <div>
                      <span className="font-semibold text-lina-deep">{adm.nome}</span>
                      <span className="ml-2 font-mono text-xs text-lina-slate">({adm.email})</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-lina-slate hidden sm:inline">
                        Adicionado em {new Date(adm.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                      {admins.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          disabled={isPendingAdmin}
                          onClick={() => handleDeleteAdmin(adm.id)}
                          className="text-rose-600 hover:bg-rose-50 hover:text-rose-700 size-8 p-0"
                          title="Remover administrador"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Cell>

            {/* Formulário para Adicionar Administrador (se < 5) */}
            {admins.length < 5 ? (
              <Cell surface="paper" padding="md" radius="md" className="border border-lina-mist">
                <div className="flex items-center gap-2">
                  <UserPlus className="size-4 text-lina-electric" aria-hidden="true" />
                  <h3 className="font-display text-sm font-bold text-lina-deep">
                    Convidar Novo Administrador
                  </h3>
                </div>

                {erroAdmin && (
                  <div className="mt-3 flex items-center gap-2 rounded-md bg-rose-50 border border-rose-200 p-2 text-xs text-rose-800">
                    <AlertCircle className="size-4 shrink-0" />
                    <span>{erroAdmin}</span>
                  </div>
                )}

                <form onSubmit={handleCreateAdmin} className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div>
                    <label className="block text-xs font-semibold text-lina-deep">Nome</label>
                    <input
                      type="text"
                      required
                      value={adminNovoNome}
                      onChange={(e) => setAdminNovoNome(e.target.value)}
                      placeholder="Nome do integrante"
                      className="mt-1 block w-full rounded-md border border-lina-slate/30 bg-lina-paper px-3 py-1.5 text-xs text-lina-ink outline-none focus:border-lina-electric"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-lina-deep">E-mail</label>
                    <input
                      type="email"
                      required
                      value={adminNovoEmail}
                      onChange={(e) => setAdminNovoEmail(e.target.value)}
                      placeholder="usuario@facom.ufu.br"
                      className="mt-1 block w-full rounded-md border border-lina-slate/30 bg-lina-paper px-3 py-1.5 text-xs text-lina-ink outline-none focus:border-lina-electric"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-lina-deep">Senha inicial</label>
                    <div className="mt-1 flex gap-2">
                      <input
                        type="password"
                        required
                        minLength={6}
                        value={adminNovaSenha}
                        onChange={(e) => setAdminNovaSenha(e.target.value)}
                        placeholder="Mínimo 6 caracteres"
                        className="block w-full rounded-md border border-lina-slate/30 bg-lina-paper px-3 py-1.5 text-xs text-lina-ink outline-none focus:border-lina-electric"
                      />
                      <Button
                        type="submit"
                        size="sm"
                        variant="solid"
                        disabled={isPendingAdmin}
                        className="shrink-0 text-xs"
                      >
                        {isPendingAdmin ? <Loader2 className="size-3.5 animate-spin" /> : 'Cadastrar'}
                      </Button>
                    </div>
                  </div>
                </form>
              </Cell>
            ) : (
              <Cell surface="paper" padding="sm" radius="md" className="border border-lina-mist text-center">
                <p className="text-xs text-lina-slate">
                  O limite máximo de 5 contas administrativas para a coordenação foi atingido.
                </p>
              </Cell>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
