import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { loginUser } from '$lib/server/auth';

export const load: PageServerLoad = async ({ locals }) => {
  // Si déjà connecté → redirect dashboard
  if (locals.user) {
    throw redirect(302, '/dashboard');
  }
  return {};
};

export const actions: Actions = {
  default: async ({ request, cookies }) => {

    const data = await request.formData();
    const email    = data.get('email')?.toString().trim();
    const password = data.get('password')?.toString();
    
    console.log('[Login] FormData entries:');
    for (const [key, value] of data.entries()) {
      console.log(`  ${key}: ${value}`);
    }
    console.log('[Login] email:', email);
    console.log('[Login] password:', password ? '***' : 'undefined');

    // ─── Validation basique ──────────────────────────────
    if (!email || !password) {
      return fail(400, {
        error: 'Email et mot de passe sont obligatoires',
        email: email ?? '',
      });
    }

    if (!email.includes('@')) {
      return fail(400, {
        error: 'Email invalide',
        email,
      });
    }

    if (password.length < 6) {
      return fail(400, {
        error: 'Mot de passe trop court',
        email,
      });
    }

    // ─── Tentative de login ──────────────────────────────
    const result = await loginUser(email, password);

    if (!result.success) {
      return fail(401, {
        error: result.error ?? 'Identifiants incorrects',
        email,
      });
    }

    // ─── Créer le cookie de session ──────────────────────
    cookies.set('session', result.token!, {
      path: '/',
      httpOnly: true,                                    // Inaccessible au JS client
      secure: process.env.NODE_ENV === 'production',     // HTTPS en prod uniquement
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7,                         // 7 jours
    });

    // ─── Redirect vers dashboard ─────────────────────────
    throw redirect(302, '/dashboard');
  }
};