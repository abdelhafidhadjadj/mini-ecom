-- 002_seed.sql — Données de base

-- Admin par défaut (mot de passe: Admin1234!)
-- Hash bcrypt généré à l'avance
INSERT INTO utilisateurs (nom, email, password_hash, role) VALUES
  ('Administrateur', 'admin@boutique.dz',
   '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMeJf85zmAPXOYXfzX7dG5mC2i',
   'admin')
ON CONFLICT (email) DO NOTHING;

-- Catalogues
INSERT INTO catalogues (nom, slug, description, ordre) VALUES
  ('Boulonnerie', 'boulonnerie', 'Vis, boulons, écrous, rondelles — toutes normes', 1),
  ('Outillage à main', 'outillage-main', 'Clés, tournevis, pinces, marteaux', 2),
  ('Électroportatif', 'electroportatif', 'Perceuses, meuleuses, ponceuses', 3),
  ('Fixation & Ancrage', 'fixation-ancrage', 'Chevilles, ancrages, tiges filetées', 4)
ON CONFLICT (slug) DO NOTHING;

-- Catégories Boulonnerie
INSERT INTO categories (catalogue_id, nom, slug, ordre) VALUES
  (1, 'Vis à tête hexagonale', 'vis-hex', 1),
  (1, 'Écrous', 'ecrous', 2),
  (1, 'Rondelles', 'rondelles', 3),
  (1, 'Boulons', 'boulons', 4)
ON CONFLICT (slug) DO NOTHING;

-- Paramètres entreprise
INSERT INTO parametres (cle, valeur) VALUES
  ('nom_entreprise', 'Outillage Pro DZ'),
  ('telephone', '+213XXXXXXXXX'),
  ('whatsapp', '+213XXXXXXXXX'),
  ('adresse', 'Alger, Algérie'),
  ('email', 'contact@outillage-pro.dz')
ON CONFLICT (cle) DO NOTHING;