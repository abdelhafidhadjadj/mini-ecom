-- ============================================================
-- 003_b2b_migration.sql — Migration B2B & Prix multi-niveaux
-- ============================================================

-- 1. Supprimer l'ancienne table prix_client si elle existe
DROP TABLE IF EXISTS prix_client CASCADE;

-- 2. Table types de clients
CREATE TABLE types_client (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  nom VARCHAR(100) NOT NULL,
  remise_defaut DECIMAL(5,2) DEFAULT 0,
  description TEXT,
  ordre INT DEFAULT 0,
  actif BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 3. Nouvelle table prix_client
CREATE TABLE prix_client (
  id SERIAL PRIMARY KEY,
  produit_id INT NOT NULL REFERENCES produits(id) ON DELETE CASCADE,
  type_client_id INT NOT NULL REFERENCES types_client(id) ON DELETE CASCADE,
  prix DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(produit_id, type_client_id)
);

CREATE TRIGGER update_prix_client_updated_at
  BEFORE UPDATE ON prix_client
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- 4. Index pour performance
CREATE INDEX idx_prix_client_produit ON prix_client(produit_id);
CREATE INDEX idx_prix_client_type ON prix_client(type_client_id);

-- 5. Table clients B2B
CREATE TABLE clients_b2b (
  id SERIAL PRIMARY KEY,
  nom_entreprise VARCHAR(255) NOT NULL,
  contact_nom VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  telephone VARCHAR(50) NOT NULL,
  password_hash TEXT NOT NULL,
  type_client_id INT REFERENCES types_client(id),
  statut VARCHAR(50) DEFAULT 'en_attente' CHECK (statut IN ('en_attente', 'approuve', 'rejete', 'suspendu')),
  wilaya VARCHAR(100),
  adresse TEXT,
  siret VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TRIGGER update_clients_b2b_updated_at
  BEFORE UPDATE ON clients_b2b
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_clients_b2b_email ON clients_b2b(email);
CREATE INDEX idx_clients_b2b_statut ON clients_b2b(statut);

-- 6. Modifier table commandes pour supporter B2B
ALTER TABLE commandes 
  ADD COLUMN IF NOT EXISTS client_b2b_id INT REFERENCES clients_b2b(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS type_prix_applique INT REFERENCES types_client(id);

-- 7. Seed types de clients
INSERT INTO types_client (code, nom, remise_defaut, ordre, description) VALUES
  ('public', 'Client Particulier', 0, 1, 'Prix grand public'),
  ('revendeur', 'Revendeur', 10, 2, 'Remise 10% - Revendeurs professionnels'),
  ('grossiste', 'Grossiste', 20, 3, 'Remise 20% - Grossistes'),
  ('super_grossiste', 'Super Grossiste', 30, 4, 'Remise 30% - Très gros volumes');

-- 8. Créer prix pour tous les produits existants
INSERT INTO prix_client (produit_id, type_client_id, prix)
SELECT 
  p.id,
  tc.id,
  CASE 
    WHEN tc.code = 'public' THEN p.prix
    WHEN tc.code = 'revendeur' THEN ROUND(p.prix * 0.90, 2)
    WHEN tc.code = 'grossiste' THEN ROUND(p.prix * 0.80, 2)
    WHEN tc.code = 'super_grossiste' THEN ROUND(p.prix * 0.70, 2)
  END
FROM produits p
CROSS JOIN types_client tc
WHERE p.actif = TRUE;

-- 9. Créer un client B2B de test (mot de passe: Admin1234!)
INSERT INTO clients_b2b (
  nom_entreprise, contact_nom, email, telephone, 
  password_hash, type_client_id, statut, wilaya
) VALUES (
  'Test Revendeur SARL',
  'Ahmed Test',
  'revendeur@test.dz',
  '+213551234567',
  '$2b$12$g.6KCqlR4dRGgAC5GHNTW.I1k2e8NL/uc2Zh44WzZteJtrnbKtqOy',
  (SELECT id FROM types_client WHERE code = 'revendeur'),
  'approuve',
  'Alger'
);