-- =============================================================================
-- FINAWA V4: Structured financing form data, CEP export tracking & permissions
-- =============================================================================

ALTER TABLE finawa_dossier
    ADD COLUMN IF NOT EXISTS dos_form_data TEXT,
    ADD COLUMN IF NOT EXISTS dos_is_draft BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS dos_last_exported_at TIMESTAMP,
    ADD COLUMN IF NOT EXISTS dos_expert_notes TEXT,
    ADD COLUMN IF NOT EXISTS dos_version INTEGER DEFAULT 1;

-- Seed permission for downloading prefilled CEP model
-- Profile 1 (ADMIN), Profile 3 (EXPERT), Profile 5 (ANALYSTE)
INSERT INTO profile_permission (prf_id, permission) VALUES
(1, 'DOWNLOAD_CEP'),
(3, 'DOWNLOAD_CEP'),
(5, 'DOWNLOAD_CEP')
ON CONFLICT DO NOTHING;
