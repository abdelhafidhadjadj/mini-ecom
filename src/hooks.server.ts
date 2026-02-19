import type { Handle } from '@sveltejs/kit';
import { verifyJWT } from '$lib/server/auth';
import { verifyJWTB2B } from '$lib/server/auth-b2b';
import { redirect } from '@sveltejs/kit';
import { createReadStream, existsSync } from 'fs';
import path from 'path';
import { lookup } from 'mime-types';

export const handle: Handle = async ({ event, resolve }) => {
  const { url, cookies } = event;

  // ─── Servir /uploads/* en développement ──────────────
  if (url.pathname.startsWith('/uploads/')) {
    const filePath = path.join('/app', url.pathname);

    if (existsSync(filePath)) {
      const mimeType = lookup(filePath) || 'application/octet-stream';
      const stream = createReadStream(filePath);

      return new Response(stream as any, {
        headers: { 'Content-Type': mimeType }
      });
    }

    return new Response('Not found', { status: 404 });
  }

  // ─── Auth Dashboard Admin ────────────────────────────
  const sessionToken = cookies.get('session');
  if (sessionToken) {
    const user = verifyJWT(sessionToken);
    if (user) {
      event.locals.user = user;
    }
  }

  // Protection routes dashboard admin
  if (url.pathname.startsWith('/dashboard')) {
    if (!event.locals.user) {
      throw redirect(302, '/login');
    }
  }

  // Redirect si déjà connecté
  if (url.pathname === '/login' && event.locals.user) {
    throw redirect(302, '/dashboard');
  }

  // ─── Auth B2B ────────────────────────────────────────
  const sessionB2B = cookies.get('session_b2b');
  if (sessionB2B) {
    const userB2B = verifyJWTB2B(sessionB2B);
    if (userB2B) {
      event.locals.userB2B = userB2B;
    }
  }

  // Protection routes B2B dashboard
  if (url.pathname.startsWith('/b2b') && !url.pathname.startsWith('/b2b-auth')) {
    if (!event.locals.userB2B) {
      throw redirect(302, '/b2b-auth/login');
    }
    if (event.locals.userB2B.statut !== 'approuve') {
      throw redirect(302, '/b2b-auth/pending');
    }
  }

  // Redirect si déjà connecté B2B
  if (url.pathname.startsWith('/b2b-auth/') && event.locals.userB2B && event.locals.userB2B.statut === 'approuve') {
    throw redirect(302, '/b2b');
  }

  // Headers sécurité
  const response = await resolve(event);
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
};