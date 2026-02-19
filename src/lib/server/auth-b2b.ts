import { compare, hash } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { query } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface B2BUser {
  id: number;
  nom_entreprise: string;
  contact_nom: string;
  email: string;
  type_client_id: number;
  type_client_code: string;
  statut: string;
}

export interface JWTPayloadB2B {
  id: number;
  email: string;
  type_client_id: number;
  type_client_code: string;
  statut: string;
}

// ─── Login client B2B ──────────────────────────────────────
export async function loginB2B(email: string, password: string): Promise<string | null> {
  const users = await query(
    `SELECT 
       cb.id, cb.nom_entreprise, cb.contact_nom, cb.email,
       cb.password_hash, cb.type_client_id, cb.statut,
       tc.code AS type_client_code
     FROM clients_b2b cb
     LEFT JOIN types_client tc ON tc.id = cb.type_client_id
     WHERE cb.email = $1`,
    [email]
  );

  if (users.length === 0) return null;

  const user = users[0];

  // Vérifier statut
  if (user.statut !== 'approuve') {
    throw new Error('ACCOUNT_NOT_APPROVED');
  }

  // Vérifier password
  const valid = await compare(password, user.password_hash);
  if (!valid) return null;

  // Générer JWT
  const payload: JWTPayloadB2B = {
    id: user.id,
    email: user.email,
    type_client_id: user.type_client_id,
    type_client_code: user.type_client_code,
    statut: user.statut,
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

// ─── Register client B2B ───────────────────────────────────
export async function registerB2B(data: {
  nom_entreprise: string;
  contact_nom: string;
  email: string;
  telephone: string;
  password: string;
  wilaya: string;
  adresse?: string;
  siret?: string;
  type_client_code: string;
}): Promise<number> {
  
  console.log('[B2B Register] Data received:', { ...data, password: '***' });

  // Vérifier email unique
  const existing = await query(
    'SELECT id FROM clients_b2b WHERE email = $1',
    [data.email]
  );

  if (existing.length > 0) {
    throw new Error('EMAIL_EXISTS');
  }

  console.log('[B2B Register] Email OK, hashing password...');

  // Hash password
  const password_hash = await hash(data.password, 12);

  console.log('[B2B Register] Password hashed, getting type_client_id...');

  // Récupérer type_client_id
  const typeClient = await query(
    'SELECT id FROM types_client WHERE code = $1',
    [data.type_client_code]
  );

  console.log('[B2B Register] Type client result:', typeClient);

  if (typeClient.length === 0) {
    throw new Error('INVALID_CLIENT_TYPE');
  }

  console.log('[B2B Register] Inserting client...');

  // Insérer
  try {
    const result = await query(
      `INSERT INTO clients_b2b 
         (nom_entreprise, contact_nom, email, telephone, password_hash,
          type_client_id, wilaya, adresse, siret, statut)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'en_attente')
       RETURNING id`,
      [
        data.nom_entreprise,
        data.contact_nom,
        data.email,
        data.telephone,
        password_hash,
        typeClient[0].id,
        data.wilaya,
        data.adresse ?? null,
        data.siret ?? null,
      ]
    );

    console.log('[B2B Register] Insert result:', result);
    return result[0].id;

  } catch (err: any) {
    console.error('[B2B Register] Insert error:', err);
    throw err;
  }
}

// ─── Verify JWT B2B ────────────────────────────────────────
export function verifyJWTB2B(token: string): JWTPayloadB2B | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayloadB2B;
  } catch {
    return null;
  }
}