// src/lib/server/auth.ts
import jwt from 'jsonwebtoken';
import { hash, compare } from 'bcrypt';
import { query } from './db';
import { JWT_SECRET } from '$env/static/private';

export interface JWTPayload {
  id: number;
  nom: string;
  email: string;
  role: 'admin' | 'agent';
}

export interface LoginResult {
  success: boolean;
  token?: string;
  user?: JWTPayload;
  error?: string;
}

// ─── Login ────────────────────────────────────────────────
export async function loginUser(
  email: string,
  password: string
): Promise<LoginResult> {
  try {
    const users = await query(
      `SELECT id, nom, email, password_hash, role 
       FROM utilisateurs 
       WHERE email = $1 AND actif = TRUE`,
      [email]
    );

    console.log('[Auth] Users trouvés:', users.length);

    const user = users[0];

    if (!user) {
      console.log('[Auth] Aucun utilisateur trouvé pour:', email);
      return { success: false, error: 'Identifiants incorrects' };
    }

    console.log('[Auth] Hash DB:', user.password_hash?.substring(0, 20) + '...');

    const valid = await compare(password, user.password_hash);

    console.log('[Auth] Password valide:', valid);

    if (!valid) {
      return { success: false, error: 'Identifiants incorrects' };
    }

    const payload: JWTPayload = {
      id: user.id,
      nom: user.nom,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: '7d',
    });

    return { success: true, token, user: payload };

  } catch (err: any) {
    console.error('[Auth] Erreur login:', err.message);
    console.error('[Auth] Stack:', err.stack);
    return { success: false, error: 'Erreur serveur' };
  }
}

// ─── Vérifier JWT ─────────────────────────────────────────
export async function verifyJWT(token: string): Promise<JWTPayload> {
  return jwt.verify(token, JWT_SECRET) as JWTPayload;
}

// ─── Hash password ────────────────────────────────────────
export async function hashPassword(password: string): Promise<string> {
  return hash(password, 12);
}

// ─── Créer admin ──────────────────────────────────────────
export async function createAdmin(
  nom: string,
  email: string,
  password: string
): Promise<void> {
  const password_hash = await hashPassword(password);
  await query(
    `INSERT INTO utilisateurs (nom, email, password_hash, role)
     VALUES ($1, $2, $3, 'admin')
     ON CONFLICT (email) DO NOTHING`,
    [nom, email, password_hash]
  );
  console.log(`[Auth] Admin créé : ${email}`);
}