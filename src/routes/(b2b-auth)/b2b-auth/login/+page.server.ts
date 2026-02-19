import type { Actions, PageServerLoad } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { loginB2B } from '$lib/server/auth-b2b';

export const load: PageServerLoad = async ({ cookies }) => {
  const token = cookies.get('session_b2b');
  if (token) {
    throw redirect(302, '/b2b');
  }
  return {};
};

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const data = await request.formData();
    const email = data.get('email')?.toString().trim();
    const password = data.get('password')?.toString();

    if (!email || !password) {
      return fail(400, { 
        error: 'Email and password are required',
        email 
      });
    }

    try {
      const token = await loginB2B(email, password);

      if (!token) {
        return fail(401, { 
          error: 'Invalid email or password',
          email 
        });
      }

      // Set cookie
      cookies.set('session_b2b', token, {
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

    } catch (err: any) {
      if (err.message === 'ACCOUNT_NOT_APPROVED') {
        return fail(403, { 
          error: 'Your account is pending approval. Please wait for admin validation.',
          email 
        });
      }

      console.error('[B2B Login] Error:', err.message);
      return fail(500, { 
        error: 'Server error, please try again',
        email 
      });
    }

    // Success - redirect OUTSIDE try-catch
    throw redirect(302, '/b2b');
  },
};