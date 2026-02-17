// src/routes/api/auth/logout/+server.ts
import type { RequestHandler } from './$types';
import { redirect } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ cookies }) => {
  cookies.delete('session', { path: '/' });
  throw redirect(302, '/login');
};