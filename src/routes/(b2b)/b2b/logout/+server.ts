import type { RequestHandler } from './$types';
import { redirect } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ cookies }) => {
  cookies.delete('session_b2b', { path: '/' });
  throw redirect(302, '/b2b-auth/login');
};