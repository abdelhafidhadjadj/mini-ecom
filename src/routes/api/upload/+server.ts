import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const UPLOADS_DIR = '/app/uploads';
const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const POST: RequestHandler = async ({ request }) => {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  const produitId = formData.get('produit_id')?.toString() ?? 'temp';

  if (!file) throw error(400, 'No file provided');
  if (file.size > MAX_SIZE) throw error(400, 'File too large (max 5MB)');
  if (!ALLOWED_TYPES.includes(file.type)) throw error(400, 'Invalid file type');

  const dir = path.join(UPLOADS_DIR, 'products', produitId);
  if (!existsSync(dir)) await mkdir(dir, { recursive: true });

  const ext = file.name.split('.').pop() ?? 'jpg';
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const filepath = path.join(dir, filename);

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filepath, buffer);

  const url = `/uploads/products/${produitId}/${filename}`;
  return json({ url });
};