
SELECT * FROM utilisateurs

--@block

SELECT id, LEFT(description, 200) FROM produits WHERE id = 9;
--@block

SELECT * FROM produit_images

--@block
SELECT b.*, tc.nom AS type_client_nom
FROM clients_b2b b
LEFT JOIN types_client tc ON tc.id = b.type_client_id
WHERE b.id = 4;

--@block

-- Insérer des commandes B2B pour le client test (id = 3)
INSERT INTO commandes (
  client_nom, client_telephone, client_wilaya, client_adresse,
  total, statut, notes, client_b2b_id, type_prix_applique
) VALUES
  ('TST sarl', '+213551234567', 'Alger', '02 RUE AHCENE KHMISSA', 
   15600.00, 'livre', 'Commande urgente', 4, 4),
  
  ('TST sarl', '+213551234567', 'Blida', '15 Avenue de la Liberté', 
   23400.00, 'expedie', NULL, 4, 4),
  
  ('TST sarl', '+213551234567', 'Alger', '02 RUE AHCENE KHMISSA', 
   8750.00, 'en_preparation', 'Livraison matin', 4, 4),
  
  ('TST sarl', '+213551234567', 'Tipaza', 'Zone industrielle Kolea', 
   31200.00, 'confirmee', NULL, 4, 4),
  
  ('TST sarl', '+213551234567', 'Alger', '02 RUE AHCENE KHMISSA', 
   12800.00, 'en_attente', 'Appeler avant livraison', 4, 4),
  
  ('TST sarl', '+213551234567', 'Boumerdes', 'Rue des Martyrs', 
   19500.00, 'livre', NULL, 4, 4),
  
  ('TST sarl', '+213551234567', 'Alger', '02 RUE AHCENE KHMISSA', 
   6400.00, 'annulee', 'Client a annulé', 4, 4);

-- Récupérer les IDs des commandes qu'on vient de créer
DO $$
DECLARE
  cmd_ids INT[] := ARRAY(
    SELECT id FROM commandes 
    WHERE client_b2b_id = 4
    ORDER BY id DESC 
    LIMIT 7
  );
BEGIN
  -- Lignes commande 1
  INSERT INTO lignes_commande (commande_id, nom_produit, quantite, prix_unitaire) VALUES
    (cmd_ids[7], 'Boulon HEX M12x50 Grade 8.8', 200, 31.50),
    (cmd_ids[7], 'Écrou HEX M12 Grade 8', 200, 8.40),
    (cmd_ids[7], 'Rondelle plate M12', 200, 3.50);

  -- Lignes commande 2
  INSERT INTO lignes_commande (commande_id, nom_produit, quantite, prix_unitaire) VALUES
    (cmd_ids[6], 'Vis CHC M8x30 Inox A2', 500, 19.95),
    (cmd_ids[6], 'Clé à molette 300mm', 10, 700.00),
    (cmd_ids[6], 'Tournevis cruciforme PH2', 20, 245.00);

  -- Lignes commande 3
  INSERT INTO lignes_commande (commande_id, nom_produit, quantite, prix_unitaire) VALUES
    (cmd_ids[5], 'Boulon M16x80 Grade 10.9', 100, 84.00),
    (cmd_ids[5], 'Pince universelle 200mm', 5, 455.00);

  -- Lignes commande 4
  INSERT INTO lignes_commande (commande_id, nom_produit, quantite, prix_unitaire) VALUES
    (cmd_ids[4], 'Perceuse à percussion 800W', 4, 2870.00),
    (cmd_ids[4], 'Disqueuse 125mm 900W', 6, 3500.00);

  -- Lignes commande 5
  INSERT INTO lignes_commande (commande_id, nom_produit, quantite, prix_unitaire) VALUES
    (cmd_ids[3], 'Cheville métallique M10', 500, 22.40),
    (cmd_ids[3], 'Tige filetée M10x1000mm', 20, 196.00);

  -- Lignes commande 6
  INSERT INTO lignes_commande (commande_id, nom_produit, quantite, prix_unitaire) VALUES
    (cmd_ids[2], 'Boulon M20x100 Grade 10.9', 150, 130.00);

  -- Lignes commande 7
  INSERT INTO lignes_commande (commande_id, nom_produit, quantite, prix_unitaire) VALUES
    (cmd_ids[1], 'Clé à chocs pneumatique', 2, 3200.00);

  -- Historique pour commandes livrées
  INSERT INTO historique_commandes (commande_id, ancien_statut, nouveau_statut, commentaire, agent_id) VALUES
    (cmd_ids[7], 'en_attente', 'confirmee', NULL, 1),
    (cmd_ids[7], 'confirmee', 'en_preparation', NULL, 1),
    (cmd_ids[7], 'en_preparation', 'expedie', 'Expédié via YALIDINE', 1),
    (cmd_ids[7], 'expedie', 'livre', 'Livré avec succès', 1);

  -- Historique pour commande expédiée
  INSERT INTO historique_commandes (commande_id, ancien_statut, nouveau_statut, commentaire, agent_id) VALUES
    (cmd_ids[6], 'en_attente', 'confirmee', NULL, 1),
    (cmd_ids[6], 'confirmee', 'en_preparation', NULL, 1),
    (cmd_ids[6], 'en_preparation', 'expedie', 'En cours de livraison', 1);

  -- Historique pour commande en préparation
  INSERT INTO historique_commandes (commande_id, ancien_statut, nouveau_statut, commentaire, agent_id) VALUES
    (cmd_ids[5], 'en_attente', 'confirmee', NULL, 1),
    (cmd_ids[5], 'confirmee', 'en_preparation', 'En cours de préparation', 1);

  -- Historique pour commande confirmée
  INSERT INTO historique_commandes (commande_id, ancien_statut, nouveau_statut, commentaire, agent_id) VALUES
    (cmd_ids[4], 'en_attente', 'confirmee', 'Commande validée', 1);

  -- Historique pour commande annulée
  INSERT INTO historique_commandes (commande_id, ancien_statut, nouveau_statut, commentaire, agent_id) VALUES
    (cmd_ids[1], 'en_attente', 'annulee', 'Client a annulé par téléphone', 1);

END $$;