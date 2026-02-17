-- ============================================================
-- 001_schema.sql — Schéma complet base de données
-- ============================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "unaccent";

-- ─── Utilisateurs (dashboard admin/agents) ──────────────
CREATE TABLE IF NOT EXISTS utilisateurs (
  id            SERIAL PRIMARY KEY,
  nom           VARCHAR(100) NOT NULL,
  email         VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role          VARCHAR(20) NOT NULL DEFAULT 'agent'
                CHECK (role IN ('admin', 'agent')),
  actif         BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMP DEFAULT NOW()
);

-- ─── Catalogues ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS catalogues (
  id            SERIAL PRIMARY KEY,
  nom           VARCHAR(150) NOT NULL,
  slug          VARCHAR(150) NOT NULL UNIQUE,
  description   TEXT,
  image_url     VARCHAR(500),
  ordre         INTEGER DEFAULT 0,
  actif         BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMP DEFAULT NOW()
);

-- ─── Catégories ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id            SERIAL PRIMARY KEY,
  catalogue_id  INTEGER NOT NULL REFERENCES catalogues(id) ON DELETE CASCADE,
  nom           VARCHAR(150) NOT NULL,
  slug          VARCHAR(150) NOT NULL UNIQUE,
  description   TEXT,
  image_url     VARCHAR(500),
  ordre         INTEGER DEFAULT 0,
  actif         BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMP DEFAULT NOW()
);

-- ─── Produits ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS produits (
  id            SERIAL PRIMARY KEY,
  categorie_id  INTEGER NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  nom           VARCHAR(255) NOT NULL,
  slug          VARCHAR(255) NOT NULL UNIQUE,
  description   TEXT,                  -- HTML (TipTap)
  reference     VARCHAR(100),          -- Ex: DIN 933, ISO 4014
  prix          NUMERIC(10,2) NOT NULL,
  unite_vente   VARCHAR(50) DEFAULT 'pièce',  -- pièce, lot 100, boîte, kg
  stock         INTEGER NOT NULL DEFAULT 0,
  stock_minimum INTEGER NOT NULL DEFAULT 5,
  actif         BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMP DEFAULT NOW(),
  updated_at    TIMESTAMP DEFAULT NOW()
);

-- ─── Images produits ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS produit_images (
  id            SERIAL PRIMARY KEY,
  produit_id    INTEGER NOT NULL REFERENCES produits(id) ON DELETE CASCADE,
  url           VARCHAR(500) NOT NULL,
  ordre         INTEGER DEFAULT 0,
  principale    BOOLEAN DEFAULT FALSE
);

-- ─── Variantes produits ───────────────────────────────────
-- (Ex: vis M8x20, M8x30, M10x20...)
CREATE TABLE IF NOT EXISTS variantes (
  id              SERIAL PRIMARY KEY,
  produit_id      INTEGER NOT NULL REFERENCES produits(id) ON DELETE CASCADE,
  nom             VARCHAR(100) NOT NULL,   -- Ex: "M8x20 Grade 8.8"
  reference       VARCHAR(100),
  prix_supplement NUMERIC(10,2) DEFAULT 0,
  stock           INTEGER NOT NULL DEFAULT 0,
  actif           BOOLEAN DEFAULT TRUE
);

-- ─── Commandes ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS commandes (
  id                       SERIAL PRIMARY KEY,
  client_nom               VARCHAR(150) NOT NULL,
  client_telephone         VARCHAR(20) NOT NULL,
  client_wilaya            VARCHAR(100) NOT NULL,
  client_adresse           TEXT,
  total                    NUMERIC(10,2) NOT NULL,
  statut                   VARCHAR(30) NOT NULL DEFAULT 'en_attente'
                           CHECK (statut IN ('en_attente','confirmee','en_preparation','expedie','livre','annulee')),
  notes                    TEXT,
  whatsapp_entreprise_sent BOOLEAN DEFAULT FALSE,
  whatsapp_client_sent     BOOLEAN DEFAULT FALSE,
  whatsapp_sid_entreprise  VARCHAR(100),
  whatsapp_sid_client      VARCHAR(100),
  agent_id                 INTEGER REFERENCES utilisateurs(id) ON DELETE SET NULL,
  created_at               TIMESTAMP DEFAULT NOW(),
  updated_at               TIMESTAMP DEFAULT NOW()
);

-- ─── Lignes de commande ───────────────────────────────────
CREATE TABLE IF NOT EXISTS lignes_commande (
  id              SERIAL PRIMARY KEY,
  commande_id     INTEGER NOT NULL REFERENCES commandes(id) ON DELETE CASCADE,
  produit_id      INTEGER REFERENCES produits(id) ON DELETE SET NULL,
  variante_id     INTEGER REFERENCES variantes(id) ON DELETE SET NULL,
  nom_produit     VARCHAR(255) NOT NULL,  -- Dénormalisé pour historique
  quantite        INTEGER NOT NULL,
  prix_unitaire   NUMERIC(10,2) NOT NULL,
  total           NUMERIC(10,2) GENERATED ALWAYS AS (quantite * prix_unitaire) STORED
);

-- ─── Historique statuts commandes ────────────────────────
CREATE TABLE IF NOT EXISTS historique_commandes (
  id            SERIAL PRIMARY KEY,
  commande_id   INTEGER NOT NULL REFERENCES commandes(id) ON DELETE CASCADE,
  ancien_statut VARCHAR(30),
  nouveau_statut VARCHAR(30) NOT NULL,
  agent_id      INTEGER REFERENCES utilisateurs(id),
  commentaire   TEXT,
  created_at    TIMESTAMP DEFAULT NOW()
);

-- ─── Paramètres entreprise ───────────────────────────────
CREATE TABLE IF NOT EXISTS parametres (
  cle   VARCHAR(100) PRIMARY KEY,
  valeur TEXT NOT NULL
);

-- ─── Triggers ────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER produits_updated_at
  BEFORE UPDATE ON produits FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER commandes_updated_at
  BEFORE UPDATE ON commandes FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── Index ────────────────────────────────────────────────
CREATE INDEX idx_produits_categorie ON produits(categorie_id);
CREATE INDEX idx_produits_slug ON produits(slug);
CREATE INDEX idx_produits_actif ON produits(actif);
CREATE INDEX idx_categories_catalogue ON categories(catalogue_id);
CREATE INDEX idx_commandes_statut ON commandes(statut);
CREATE INDEX idx_commandes_telephone ON commandes(client_telephone);
CREATE INDEX idx_commandes_created ON commandes(created_at DESC);
CREATE INDEX idx_lignes_commande ON lignes_commande(commande_id);