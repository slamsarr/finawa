-- =============================================================================
-- FINAWA V3: Seed permissions, labels, enterprise profiles, partners and baseline dossiers
-- =============================================================================

-- 1. Profile permissions
INSERT INTO profile_permission (prf_id, permission) VALUES
(2, 'READ_DOSSIER'), (2, 'ADD_DOSSIER'), (2, 'EDIT_DOSSIER'), (2, 'SUBMIT_DOSSIER'),
(2, 'READ_DOCUMENT'), (2, 'ADD_DOCUMENT'), (2, 'EDIT_DOCUMENT'), (2, 'DELETE_DOCUMENT'), (2, 'READ_FILE_DOCUMENT'),
(2, 'READ_REFERENTIAL'), (2, 'READ_PARTNER'), (2, 'READ_MATCHING')
ON CONFLICT DO NOTHING;

INSERT INTO profile_permission (prf_id, permission) VALUES
(5, 'READ_DOSSIER'), (5, 'EDIT_STATUS_DOSSIER'), (5, 'READ_DOCUMENT'), (5, 'READ_FILE_DOCUMENT'),
(5, 'READ_PARTNER'), (5, 'READ_MATCHING'), (5, 'READ_REFERENTIAL')
ON CONFLICT DO NOTHING;

INSERT INTO profile_permission (prf_id, permission) VALUES
(3, 'READ_DOSSIER'), (3, 'EDIT_DOSSIER'), (3, 'EDIT_STATUS_DOSSIER'), (3, 'READ_DOCUMENT'), (3, 'READ_FILE_DOCUMENT'),
(3, 'READ_PARTNER'), (3, 'READ_MATCHING'), (3, 'RUN_MATCHING'), (3, 'EDIT_MATCHING'), (3, 'READ_REFERENTIAL')
ON CONFLICT DO NOTHING;

INSERT INTO profile_permission (prf_id, permission) VALUES
(4, 'READ_DOSSIER'), (4, 'EDIT_STATUS_DOSSIER'), (4, 'READ_DOCUMENT'), (4, 'READ_FILE_DOCUMENT'),
(4, 'READ_PARTNER'), (4, 'EDIT_PARTNER'), (4, 'READ_MATCHING'), (4, 'EDIT_MATCHING'), (4, 'READ_REFERENTIAL')
ON CONFLICT DO NOTHING;

-- 2. Labels / Referentials
INSERT INTO finawa_label (lbl_type, lbl_name, lbl_description, created_date) VALUES
('NEED_TYPE', 'Financement', 'Crédit d’équipement, trésorerie, facilités de caisse', NOW()),
('NEED_TYPE', 'Accompagnement', 'Mise en conformité, comptabilité, business plan', NOW()),
('NEED_TYPE', 'Investissement', 'Ouverture de capital, quasi-fonds propres, dette privée', NOW())
ON CONFLICT DO NOTHING;

INSERT INTO finawa_label (lbl_type, lbl_name, lbl_description, created_date) VALUES
('ENTERPRISE_TYPE', 'SARL', 'Société à Responsabilité Limitée', NOW()),
('ENTERPRISE_TYPE', 'SAS', 'Société par Actions Simplifiée', NOW()),
('ENTERPRISE_TYPE', 'SUARL', 'Société Unipersonnelle à Responsabilité Limitée', NOW()),
('ENTERPRISE_TYPE', 'SA', 'Société Anonyme', NOW()),
('ENTERPRISE_TYPE', 'GIE', 'Groupement d’Intérêt Économique', NOW())
ON CONFLICT DO NOTHING;

INSERT INTO finawa_label (lbl_type, lbl_name, lbl_description, created_date) VALUES
('ENTERPRISE_SECTOR', 'Agriculture', 'Secteur agricole et maraîcher', NOW()),
('ENTERPRISE_SECTOR', 'Commerce', 'Commerce général et distribution', NOW()),
('ENTERPRISE_SECTOR', 'Transformation agroalimentaire', 'Industrie agroalimentaire et conditionnement', NOW()),
('ENTERPRISE_SECTOR', 'Digital & Numérique', 'Services informatiques et technologies', NOW()),
('ENTERPRISE_SECTOR', 'BTP & Construction', 'Bâtiment et travaux publics', NOW()),
('ENTERPRISE_SECTOR', 'Santé & Pharmacie', 'Établissements médicaux et équipements', NOW()),
('ENTERPRISE_SECTOR', 'Industrie', 'Production manufacturière et artisanat', NOW())
ON CONFLICT DO NOTHING;

INSERT INTO finawa_label (lbl_type, lbl_name, lbl_description, created_date) VALUES
('DOCUMENT_TYPE', 'RCCM / Registre du commerce', 'Document juridique d’immatriculation', NOW()),
('DOCUMENT_TYPE', 'NINEA & Avis d’immatriculation', 'Identifiant fiscal officiel', NOW()),
('DOCUMENT_TYPE', 'États financiers SYSCOHADA', 'Bilans et comptes de résultat certifiés', NOW()),
('DOCUMENT_TYPE', 'Relevés bancaires (6 mois)', 'Historique des flux de trésorerie bancaires', NOW()),
('DOCUMENT_TYPE', 'Business Plan bancable', 'Dossier prévisionnel et étude de marché', NOW()),
('DOCUMENT_TYPE', 'Attestation de garantie FONGIP', 'Engagement de couverture de risque', NOW())
ON CONFLICT DO NOTHING;

INSERT INTO finawa_label (lbl_type, lbl_name, lbl_description, created_date) VALUES
('PARTNER_TYPE', 'Banque commerciale', 'Banque de premier rang pour PME et grandes entreprises', NOW()),
('PARTNER_TYPE', 'Microfinance (SFD)', 'Système Financier Décentralisé pour TPE et PME', NOW()),
('PARTNER_TYPE', 'Fonds d’investissement', 'Capital-risque et investisseurs institutionnels', NOW()),
('PARTNER_TYPE', 'Garantie publique', 'Organisme étatique de cautionnement et garantie', NOW())
ON CONFLICT DO NOTHING;

-- 3. Default enterprise profile for enterprise@finawa.com
INSERT INTO finawa_enterprise (
    ent_user_id, ent_name, ent_summary, ent_region, ent_turnover, ent_employees, ent_date,
    ent_linked_enterprise_type, ent_linked_sector_type, created_date
)
SELECT 
    2, 
    'Teranga Agro SARL', 
    'Production, calibrage et distribution de produits agroalimentaires à haute valeur ajoutée.',
    'Dakar',
    48000000,
    18,
    '2021-03-15 09:00:00',
    (SELECT lbl_id FROM finawa_label WHERE lbl_type = 'ENTERPRISE_TYPE' AND lbl_name = 'SARL' LIMIT 1),
    (SELECT lbl_id FROM finawa_label WHERE lbl_type = 'ENTERPRISE_SECTOR' AND lbl_name = 'Transformation agroalimentaire' LIMIT 1),
    NOW()
WHERE NOT EXISTS (SELECT 1 FROM finawa_enterprise WHERE ent_user_id = 2);

-- 4. Real partners
INSERT INTO finawa_partner (
    prt_name, prt_type, prt_description, prt_conditions, prt_pricing,
    prt_min_amount, prt_max_amount, prt_min_duration_months, prt_max_duration_months,
    prt_interest_rate, prt_score, prt_active, prt_linked_partner_type, created_date
) VALUES
('CBAO Groupe Attijariwafa Bank', 'Banque commerciale', 'Banque de référence pour le financement des PME industrielles et de services.', 'Minimum 2 ans d’existence, bilans certifiés SYSCOHADA.', 'Frais de dossier 1% · Taux indicatif 8.5% à 10.5%', 10000000, 500000000, 12, 84, 8.50, 92, true, (SELECT lbl_id FROM finawa_label WHERE lbl_type = 'PARTNER_TYPE' AND lbl_name = 'Banque commerciale' LIMIT 1), NOW()),
('BICI-S (BNP Paribas Group)', 'Banque commerciale', 'Solutions de trésorerie, escompte commercial et crédit d’investissement moyen terme.', 'RCCM valide, NINEA certifié, couverture de garantie 50%.', 'Frais de dossier 1.2% · Taux indicatif 9.0%', 15000000, 750000000, 24, 72, 9.00, 89, true, (SELECT lbl_id FROM finawa_label WHERE lbl_type = 'PARTNER_TYPE' AND lbl_name = 'Banque commerciale' LIMIT 1), NOW()),
('FONGIP (Fonds de Garantie)', 'Garantie publique', 'Garantie souveraine publique couvrant 50% à 70% du risque de crédit bancaire.', 'Entreprise sénégalaise, secteur prioritaire, avis favorable comité technique.', 'Commission de garantie 1.5% an', 5000000, 200000000, 12, 60, 1.50, 95, true, (SELECT lbl_id FROM finawa_label WHERE lbl_type = 'PARTNER_TYPE' AND lbl_name = 'Garantie publique' LIMIT 1), NOW()),
('DER/FJ (Délégation Générale)', 'Garantie publique', 'Financement direct et appui technique pour jeunes et femmes entrepreneurs.', 'Moins de 40 ans ou dirigeante femme, dossier d’activité formalisé.', 'Taux bonifié 5% fixe', 1000000, 50000000, 6, 36, 5.00, 91, true, (SELECT lbl_id FROM finawa_label WHERE lbl_type = 'PARTNER_TYPE' AND lbl_name = 'Garantie publique' LIMIT 1), NOW()),
('Teranga Capital', 'Fonds d’investissement', 'Fonds d’impact dédié aux PME sénégalaises à fort potentiel de croissance.', 'Chiffre d’affaires > 50M FCFA, gouvernance formalisée, rentabilité prouvée.', 'Participation minoritaire (20% à 35%)', 30000000, 300000000, 36, 84, 0.00, 88, true, (SELECT lbl_id FROM finawa_label WHERE lbl_type = 'PARTNER_TYPE' AND lbl_name = 'Fonds d’investissement' LIMIT 1), NOW())
ON CONFLICT DO NOTHING;

-- 5. Baseline real dossier
INSERT INTO finawa_dossier (
    dos_reference, dos_enterprise_id, dos_linked_need_type, dos_amount, dos_duration_months,
    dos_purpose, dos_status, dos_score, dos_submission_date, dos_next_action, dos_description,
    dos_ca_valid, dos_ninea_provided, dos_guarantee_complete, created_date
)
SELECT
    'FIN-2026-0001',
    (SELECT ent_id FROM finawa_enterprise WHERE ent_name = 'Teranga Agro SARL' LIMIT 1),
    (SELECT lbl_id FROM finawa_label WHERE lbl_type = 'NEED_TYPE' AND lbl_name = 'Financement' LIMIT 1),
    25000000.00,
    36,
    'Acquisition d’une ligne de tri/calibrage agroalimentaire et BFR saisonnier.',
    'EN_COURS',
    78,
    '2026-08-02 10:00:00',
    'Compléter les états financiers 2025 et attestation fiscale',
    'Dossier d’investissement d’équipement agro-industriel avec garantie FONGIP en cours de sollicitation.',
    true, true, false,
    NOW()
WHERE NOT EXISTS (SELECT 1 FROM finawa_dossier WHERE dos_reference = 'FIN-2026-0001');
