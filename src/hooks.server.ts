import type { Handle } from '@sveltejs/kit';
import { redirect } from '@sveltejs/kit';
import { verifyJWT } from '$lib/server/auth';

export const handle: Handle = async ({ event, resolve }) => {

  // ─── 1. Lire le cookie de session ──────────────────────
  const token = event.cookies.get('session');

  if (token) {
    try {
      const user = await verifyJWT(token);
      event.locals.user = user;
    } catch {
      // Token expiré ou invalide → supprimer le cookie
      event.cookies.delete('session', { path: '/' });
    }
  }

  // ─── 2. Définir les routes protégées ───────────────────
  const pathname = event.url.pathname;

  const isDashboard = pathname.startsWith('/dashboard');
  const isLoginPage = pathname.startsWith('/login');
  const isApiAuth  = pathname.startsWith('/api/auth');

  // ─── 3. Protection dashboard ───────────────────────────
  // Si pas connecté et essaie d'accéder au dashboard → login
  if (isDashboard && !event.locals.user) {
    throw redirect(302, '/login');
  }

  // ─── 4. Redirection si déjà connecté ──────────────────
  // Si déjà connecté et va sur /login → dashboard
  if (isLoginPage && event.locals.user) {
    throw redirect(302, '/dashboard');
  }

  // ─── 5. Headers de sécurité ────────────────────────────
  const response = await resolve(event);

  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
};