'use client';

import { useActionState } from 'react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Lock, Mail, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { loginAction, type ActionResult } from '@/lib/actions/auth';

export function LoginForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState<ActionResult | null, FormData>(
    loginAction,
    null
  );

  useEffect(() => {
    if (state?.success) {
      router.push('/dashboard');
      router.refresh();
    }
  }, [state, router]);

  return (
    <form action={formAction} className="mt-6 space-y-4">
      {state?.error && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-md border border-rose-200 bg-rose-50 p-3 text-xs text-rose-900"
        >
          <AlertCircle className="size-4 shrink-0 text-rose-600" aria-hidden="true" />
          <span>{state.error}</span>
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-xs font-semibold text-lina-deep uppercase tracking-wider">
          E-mail cadastrado
        </label>
        <div className="relative mt-1.5">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-lina-slate/60">
            <Mail className="size-4" aria-hidden="true" />
          </div>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="admin@lina.facom.ufu.br"
            className="block w-full rounded-md border border-lina-slate/30 bg-lina-paper py-2 pr-3 pl-9 text-sm text-lina-ink shadow-xs outline-none transition-all placeholder:text-lina-slate/40 focus:border-lina-electric focus:ring-2 focus:ring-lina-electric/20"
          />
        </div>
      </div>

      <div>
        <label htmlFor="senha" className="block text-xs font-semibold text-lina-deep uppercase tracking-wider">
          Senha de acesso
        </label>
        <div className="relative mt-1.5">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-lina-slate/60">
            <Lock className="size-4" aria-hidden="true" />
          </div>
          <input
            id="senha"
            name="senha"
            type="password"
            required
            autoComplete="current-password"
            placeholder="••••••••••••"
            className="block w-full rounded-md border border-lina-slate/30 bg-lina-paper py-2 pr-3 pl-9 text-sm text-lina-ink shadow-xs outline-none transition-all placeholder:text-lina-slate/40 focus:border-lina-electric focus:ring-2 focus:ring-lina-electric/20"
          />
        </div>
      </div>

      <Button
        type="submit"
        size="lg"
        variant="solid"
        disabled={isPending}
        className="w-full mt-4"
      >
        {isPending ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            Autenticando...
          </>
        ) : (
          'Entrar no Painel'
        )}
      </Button>
    </form>
  );
}
