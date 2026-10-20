package sn.finawa.service.cep.impl;

import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import sn.finawa.dto.form.*;
import sn.finawa.entity.DossierEntity;
import sn.finawa.exception.InternalError;
import sn.finawa.service.cep.CepCellMapping;
import sn.finawa.service.cep.CepExportService;

import java.io.*;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
public class CepExportServiceImpl implements CepExportService {

    @Value("${cep.template-path:}")
    private String customTemplatePath;

    private static final String CLASSPATH_TEMPLATE = "templates/cep/CEP Modèle.xlsx";
    private static final DateTimeFormatter FILE_DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss");

    @Override
    public CepExportResult exportCep(DossierEntity dossier, DossierFormData formData, List<String> providedDocNames) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        generateCepWorkbook(dossier, formData, providedDocNames, baos);

        byte[] bytes = baos.toByteArray();
        validateGeneratedWorkbook(bytes);

        String reference = (dossier != null && dossier.getReference() != null)
                ? dossier.getReference().replaceAll("[^a-zA-Z0-9.-]", "_")
                : "DOSSIER";
        String timestamp = LocalDateTime.now().format(FILE_DATE_FORMATTER);
        String filename = String.format("CEP_%s_%s.xlsx", reference, timestamp);

        Resource resource = new ByteArrayResource(bytes);
        return new CepExportResult(resource, filename, bytes.length);
    }

    @Override
    public void generateCepWorkbook(DossierEntity dossier, DossierFormData formData, List<String> providedDocNames, OutputStream outputStream) {
        if (formData == null) {
            formData = new DossierFormData();
        }

        try (InputStream templateStream = openTemplateInputStream();
             Workbook workbook = new XSSFWorkbook(templateStream)) {

            // 1. Validation de l'intégrité des 16 feuilles
            validateWorkbookSheets(workbook);

            // 2. Remplissage feuille 'Landing Page'
            fillLandingPage(workbook, dossier, formData);

            // 3. Remplissage feuille 'Sommaire'
            fillSommaire(workbook, dossier, formData);

            // 4. Remplissage feuille 'Checklist'
            fillChecklist(workbook, providedDocNames);

            // 5. Activation du recalcul forcé des formules à l'ouverture du classeur
            workbook.setForceFormulaRecalculation(true);

            // 6. Écriture dans le flux de sortie
            workbook.write(outputStream);
            log.info("Modèle CEP prérempli généré avec succès pour le dossier ID={}", dossier != null ? dossier.getId() : "N/A");

        } catch (IOException e) {
            log.error("Erreur lors de la génération du modèle CEP", e);
            throw new InternalError("Impossible de générer le modèle CEP prérempli: " + e.getMessage());
        }
    }

    private InputStream openTemplateInputStream() throws IOException {
        // Priorité 1 : Chemin personnalisé via application.yml ou variable d'environnement
        if (customTemplatePath != null && !customTemplatePath.isBlank()) {
            Path path = Paths.get(customTemplatePath);
            if (Files.exists(path)) {
                log.info("Chargement du modèle CEP depuis le chemin personnalisé: {}", path.toAbsolutePath());
                return Files.newInputStream(path);
            }
        }

        // Priorité 2 : Template embarqué dans le classpath
        ClassPathResource cpr = new ClassPathResource(CLASSPATH_TEMPLATE);
        if (cpr.exists()) {
            log.info("Chargement du modèle CEP depuis le classpath: {}", CLASSPATH_TEMPLATE);
            return cpr.getInputStream();
        }

        // Priorité 3 : Chemins relatifs standard
        String[] fallbackPaths = {
                "CEP Modèle.xlsx",
                "../CEP Modèle.xlsx",
                "src/main/resources/templates/cep/CEP Modèle.xlsx"
        };
        for (String fp : fallbackPaths) {
            Path p = Paths.get(fp);
            if (Files.exists(p)) {
                log.info("Chargement du modèle CEP depuis le chemin fallback: {}", p.toAbsolutePath());
                return Files.newInputStream(p);
            }
        }

        throw new FileNotFoundException("Le modèle original 'CEP Modèle.xlsx' est introuvable.");
    }

    private void validateWorkbookSheets(Workbook workbook) {
        int sheetCount = workbook.getNumberOfSheets();
        if (sheetCount < CepCellMapping.EXPECTED_SHEET_COUNT) {
            log.warn("Le classeur contient {} feuilles, {} étaient attendues.", sheetCount, CepCellMapping.EXPECTED_SHEET_COUNT);
        }
        for (String expectedSheet : CepCellMapping.EXPECTED_SHEETS) {
            if (workbook.getSheet(expectedSheet) == null) {
                log.warn("Feuille attendue manquante dans le classeur: '{}'", expectedSheet);
            }
        }
    }

    // =========================================================================
    // REMPLISSAGE LANDING PAGE
    // =========================================================================
    private void fillLandingPage(Workbook workbook, DossierEntity dossier, DossierFormData formData) {
        Sheet sheet = workbook.getSheet(CepCellMapping.SHEET_LANDING_PAGE);
        if (sheet == null) {
            log.error("Feuille '{}' absente du classeur CEP.", CepCellMapping.SHEET_LANDING_PAGE);
            return;
        }

        EnterpriseInfoDto ent = formData.getEnterprise() != null ? formData.getEnterprise() : new EnterpriseInfoDto();
        FinancingRequestDto fin = formData.getFinancing() != null ? formData.getFinancing() : new FinancingRequestDto();
        FinancialInfoDto fi = formData.getFinancial() != null ? formData.getFinancial() : new FinancialInfoDto();

        // Récupérer le nom de l'entreprise (formData prioritaire, puis entité)
        String legalName = firstNonBlank(ent.getLegalName(), dossier != null && dossier.getEnterprise() != null ? dossier.getEnterprise().getName() : null);
        String sector = firstNonBlank(ent.getSector(), dossier != null && dossier.getEnterprise() != null && dossier.getEnterprise().getSector() != null ? dossier.getEnterprise().getSector().getName() : null);

        // Chiffre d'affaires
        BigDecimal caEstime = fi.getCurrentYearEstimatedTurnover() != null ? fi.getCurrentYearEstimatedTurnover() : fi.getLastYearTurnover();
        if (caEstime == null && dossier != null && dossier.getEnterprise() != null && dossier.getEnterprise().getAnnualTurnover() != null) {
            caEstime = BigDecimal.valueOf(dossier.getEnterprise().getAnnualTurnover());
        }

        // Montants financement
        BigDecimal desiredAmount = fin.getDesiredAmount() != null ? fin.getDesiredAmount() : (dossier != null ? dossier.getAmount() : null);
        BigDecimal exactAmount = fin.getExactAmount() != null ? fin.getExactAmount() : desiredAmount;

        // Nature du besoin
        String needType = firstNonBlank(fin.getNeedType(), dossier != null && dossier.getNeedType() != null ? dossier.getNeedType().getName() : null);

        // Ancienneté & Employés
        String seniority = ent.getSeniority();
        Long employees = ent.getEmployees() != null ? ent.getEmployees() : (dossier != null && dossier.getEnterprise() != null ? dossier.getEnterprise().getEmployeeCount() : null);
        String cityZone = firstNonBlank(ent.getCityZone(), ent.getCity(), dossier != null && dossier.getEnterprise() != null ? dossier.getEnterprise().getRegion() : null);

        // Données générales (colonne E)
        writeCell(sheet, CepCellMapping.LP_NOM_STRUCTURE, legalName);
        writeCell(sheet, CepCellMapping.LP_SECTEUR_ACTIVITES, sector);
        writeCell(sheet, CepCellMapping.LP_CA_ESTIME, caEstime);
        writeCell(sheet, CepCellMapping.LP_MONTANT_SOUHAITE, desiredAmount);
        writeCell(sheet, CepCellMapping.LP_MONTANT_PRECIS, exactAmount);
        writeCell(sheet, CepCellMapping.LP_NATURE_BESOIN, needType);
        writeCell(sheet, CepCellMapping.LP_ANCIENNETE, seniority);
        writeCell(sheet, CepCellMapping.LP_EMPLOYES, employees);
        writeCell(sheet, CepCellMapping.LP_VILLE_ZONE, cityZone);

        // Contacts (colonne K)
        writeCell(sheet, CepCellMapping.LP_DIRIGEANT, ent.getManagerName());
        writeCell(sheet, CepCellMapping.LP_TELEPHONE, ent.getPhone());
        writeCell(sheet, CepCellMapping.LP_EMAIL, ent.getEmail());
        writeCell(sheet, CepCellMapping.LP_PREFERENCE_APPEL, fin.getContactPreference());
        writeCell(sheet, CepCellMapping.LP_URGENCE, fin.getUrgency());
        writeCell(sheet, CepCellMapping.LP_SOURCE, fin.getSource());
    }

    // =========================================================================
    // REMPLISSAGE SOMMAIRE
    // =========================================================================
    private void fillSommaire(Workbook workbook, DossierEntity dossier, DossierFormData formData) {
        Sheet sheet = workbook.getSheet(CepCellMapping.SHEET_SOMMAIRE);
        if (sheet == null) {
            log.error("Feuille '{}' absente du classeur CEP.", CepCellMapping.SHEET_SOMMAIRE);
            return;
        }

        EnterpriseInfoDto ent = formData.getEnterprise() != null ? formData.getEnterprise() : new EnterpriseInfoDto();
        FinancialInfoDto fi = formData.getFinancial() != null ? formData.getFinancial() : new FinancialInfoDto();

        String legalName = firstNonBlank(ent.getLegalName(), dossier != null && dossier.getEnterprise() != null ? dossier.getEnterprise().getName() : null);
        String legalForm = firstNonBlank(ent.getLegalForm(), dossier != null && dossier.getEnterprise() != null && dossier.getEnterprise().getType() != null ? dossier.getEnterprise().getType().getName() : null);

        // Section Données générales
        writeCell(sheet, CepCellMapping.SOM_NOM_STRUCTURE, legalName);
        writeCell(sheet, CepCellMapping.SOM_ANNEE_CREATION, ent.getCreationYear());
        writeCell(sheet, CepCellMapping.SOM_FORME_JURIDIQUE, legalForm);
        writeCell(sheet, CepCellMapping.SOM_ACTIVITE_PRINCIPALE, firstNonBlank(ent.getMainActivity(), ent.getDescription()));
        writeCell(sheet, CepCellMapping.SOM_ADRESSE, ent.getAddress());
        writeCell(sheet, CepCellMapping.SOM_VILLE, firstNonBlank(ent.getCity(), ent.getCityZone()));
        writeCell(sheet, CepCellMapping.SOM_POINT_FOCAL, ent.getFocalPointName());
        writeCell(sheet, CepCellMapping.SOM_FONCTION_POINT_FOCAL, ent.getFocalPointRole());
        writeCell(sheet, CepCellMapping.SOM_TELEPHONE, ent.getPhone());
        writeCell(sheet, CepCellMapping.SOM_EMAIL, ent.getEmail());

        // Section Système comptable
        writeCell(sheet, CepCellMapping.SOM_DERNIER_EXERCICE, fi.getLastClosedExercise());
        writeCell(sheet, CepCellMapping.SOM_ETATS_FINANCIERS_CERTIFIES, fi.getCertifiedStatements());
        writeCell(sheet, CepCellMapping.SOM_CABINET_COMPTABLE, fi.getAccountingAssistanceFirm());
        writeCell(sheet, CepCellMapping.SOM_COMMISSAIRE_COMPTES, fi.getStatutoryAuditor());

        // 1. Table Actionnariat (max 4 lignes)
        fillActionnariat(sheet, formData.getShareholders(), formData);

        // 2. Table Management & Organigramme (max 7 lignes)
        fillManagement(sheet, formData.getManagers(), formData);

        // 3. Historique de l'entreprise
        fillHistorique(sheet, formData);

        // 4. Relations bancaires
        fillRelationsBancaires(sheet, formData.getBankRelations(), formData);

        // 5. Activités / Produits
        fillActivites(sheet, formData.getProducts());

        // 6. Liste des biens
        fillBiens(sheet, formData.getAssets());

        // 7. Principaux clients
        fillClients(sheet, formData.getClients(), formData.getClientsObservations());

        // 8. Principaux fournisseurs
        fillFournisseurs(sheet, formData.getSuppliers(), formData.getSuppliersObservations());
    }

    private void fillActionnariat(Sheet sheet, List<ShareholderDto> shareholders, DossierFormData formData) {
        if (shareholders == null) {
            shareholders = List.of();
        }

        int count = Math.min(shareholders.size(), CepCellMapping.SOM_ACTIONNARIAT_MAX_ROWS);
        for (int i = 0; i < count; i++) {
            ShareholderDto sh = shareholders.get(i);
            int rowIdx = CepCellMapping.SOM_ACTIONNARIAT_ROWS[i];
            Row row = getOrCreateRow(sheet, rowIdx);

            if (sh.getFirstName() != null && !sh.getFirstName().isBlank()) {
                setCellValue(getOrCreateCell(row, CepCellMapping.SOM_COL_PRENOM), sh.getFirstName());
            }
            if (sh.getLastName() != null && !sh.getLastName().isBlank()) {
                setCellValue(getOrCreateCell(row, CepCellMapping.SOM_COL_NOM), sh.getLastName());
            }
            if (sh.getSharePercentage() != null) {
                // Si la valeur est > 1, convertir ex: 40 (%) -> 0.40
                BigDecimal pct = sh.getSharePercentage();
                if (pct.compareTo(BigDecimal.ONE) > 0) {
                    pct = pct.divide(BigDecimal.valueOf(100), 4, java.math.RoundingMode.HALF_UP);
                }
                setCellValue(getOrCreateCell(row, CepCellMapping.SOM_COL_POURCENT), pct.doubleValue());
            }
        }

        // Si plus de 4 actionnaires, consigner les actionnaires supplémentaires dans la note de gouvernance
        if (shareholders.size() > CepCellMapping.SOM_ACTIONNARIAT_MAX_ROWS) {
            StringBuilder extraNotes = new StringBuilder();
            if (formData.getManagementObservations() != null && !formData.getManagementObservations().isBlank()) {
                extraNotes.append(formData.getManagementObservations()).append("\n");
            }
            extraNotes.append("Associés complémentaires déclarés non intégrables dans le tableau standard (4 lignes) :\n");
            for (int i = CepCellMapping.SOM_ACTIONNARIAT_MAX_ROWS; i < shareholders.size(); i++) {
                ShareholderDto extra = shareholders.get(i);
                extraNotes.append(String.format("- %s %s : %s%%\n",
                        extra.getFirstName() != null ? extra.getFirstName() : "",
                        extra.getLastName() != null ? extra.getLastName() : "",
                        extra.getSharePercentage() != null ? extra.getSharePercentage() : "—"));
            }
            formData.setManagementObservations(extraNotes.toString());
        }
    }

    private void fillManagement(Sheet sheet, List<ManagerDto> managers, DossierFormData formData) {
        if (managers != null) {
            int count = Math.min(managers.size(), CepCellMapping.SOM_MANAGEMENT_MAX_ROWS);
            for (int i = 0; i < count; i++) {
                ManagerDto m = managers.get(i);
                int rowIdx = CepCellMapping.SOM_MANAGEMENT_ROWS[i];
                Row row = getOrCreateRow(sheet, rowIdx);

                if (m.getFirstName() != null) {
                    setCellValue(getOrCreateCell(row, CepCellMapping.SOM_COL_PRENOM), m.getFirstName());
                }
                if (m.getLastName() != null) {
                    setCellValue(getOrCreateCell(row, CepCellMapping.SOM_COL_NOM), m.getLastName());
                }
                String roleAndExp = m.getRole() != null ? m.getRole() : "";
                if (m.getExperienceYears() != null && !m.getExperienceYears().isBlank()) {
                    roleAndExp += (roleAndExp.isEmpty() ? "" : " / ") + m.getExperienceYears() + " ans d'exp.";
                }
                if (!roleAndExp.isEmpty()) {
                    setCellValue(getOrCreateCell(row, CepCellMapping.SOM_COL_FONCTION_EXP), roleAndExp);
                }
            }
        }

        // Note / Observation Organigramme en D85
        if (formData.getManagementObservations() != null && !formData.getManagementObservations().isBlank()) {
            Row row = getOrCreateRow(sheet, CepCellMapping.SOM_ROW_ORGANIGRAMME_OBS);
            setCellValue(getOrCreateCell(row, CepCellMapping.SOM_COL_ORGANIGRAMME_OBS), formData.getManagementObservations());
        }
    }

    private void fillHistorique(Sheet sheet, DossierFormData formData) {
        StringBuilder histText = new StringBuilder();
        if (formData.getHistory() != null && !formData.getHistory().isBlank()) {
            histText.append(formData.getHistory().trim());
        }
        if (formData.getMilestones() != null && !formData.getMilestones().isBlank()) {
            if (histText.length() > 0) histText.append("\n\nÉtapes clés de développement :\n");
            histText.append(formData.getMilestones().trim());
        }
        if (histText.length() > 0) {
            Row row = getOrCreateRow(sheet, CepCellMapping.SOM_ROW_HISTORIQUE);
            setCellValue(getOrCreateCell(row, CepCellMapping.SOM_COL_HISTORIQUE), histText.toString());
        }
    }

    private void fillRelationsBancaires(Sheet sheet, List<BankRelationItemDto> bankRelations, DossierFormData formData) {
        if (bankRelations != null && !bankRelations.isEmpty()) {
            int count = Math.min(bankRelations.size(), CepCellMapping.SOM_BANQUE_MAX_ROWS);
            for (int i = 0; i < count; i++) {
                BankRelationItemDto b = bankRelations.get(i);
                int rowIdx = CepCellMapping.SOM_BANQUE_ROWS[i];
                Row row = getOrCreateRow(sheet, rowIdx);

                if (b.getBankName() != null) {
                    setCellValue(getOrCreateCell(row, CepCellMapping.SOM_COL_BANQUE), b.getBankName());
                }
                if (b.getCurrentCommitment() != null) {
                    setCellValue(getOrCreateCell(row, CepCellMapping.SOM_COL_ENGAGEMENT), b.getCurrentCommitment());
                }
                if (b.getAccountNumber() != null) {
                    setCellValue(getOrCreateCell(row, CepCellMapping.SOM_COL_NUM_COMPTE), b.getAccountNumber());
                }
            }

            // Coordonnées première agence (ligne 119)
            BankRelationItemDto first = bankRelations.get(0);
            Row agenceRow = getOrCreateRow(sheet, CepCellMapping.SOM_ROW_AGENCE);
            if (first.getAgency() != null) {
                setCellValue(getOrCreateCell(agenceRow, CepCellMapping.SOM_COL_AGENCE_NOM), first.getAgency());
            }
            if (first.getAgencyPhone() != null) {
                setCellValue(getOrCreateCell(agenceRow, CepCellMapping.SOM_COL_AGENCE_TEL), first.getAgencyPhone());
            }
            if (first.getAgencyEmail() != null) {
                setCellValue(getOrCreateCell(agenceRow, CepCellMapping.SOM_COL_AGENCE_EMAIL), first.getAgencyEmail());
            }
        }

        // Observations bancaires
        String obs = formData.getBankingObservations();
        if (obs != null && !obs.isBlank()) {
            Row obsRow = getOrCreateRow(sheet, CepCellMapping.SOM_ROW_BANQUE_OBS);
            setCellValue(getOrCreateCell(obsRow, CepCellMapping.SOM_COL_BANQUE_OBS), obs);
        }
    }

    private void fillActivites(Sheet sheet, List<ProductActivityItemDto> products) {
        if (products == null) return;
        int count = Math.min(products.size(), CepCellMapping.SOM_ACTIVITES_MAX_ROWS);
        for (int i = 0; i < count; i++) {
            ProductActivityItemDto p = products.get(i);
            int rowIdx = CepCellMapping.SOM_ACTIVITES_ROWS[i];
            Row row = getOrCreateRow(sheet, rowIdx);

            if (p.getName() != null) {
                setCellValue(getOrCreateCell(row, CepCellMapping.SOM_COL_PRODUIT_NOM), p.getName());
            }
            if (p.getShareTurnoverN1() != null) {
                setCellValue(getOrCreateCell(row, CepCellMapping.SOM_COL_PART_CA_N1), p.getShareTurnoverN1());
            }
            if (p.getShareTurnoverN2() != null) {
                setCellValue(getOrCreateCell(row, CepCellMapping.SOM_COL_PART_CA_N2), p.getShareTurnoverN2());
            }
        }
    }

    private void fillBiens(Sheet sheet, List<AssetItemDto> assets) {
        if (assets == null) return;
        int count = Math.min(assets.size(), CepCellMapping.SOM_BIENS_MAX_ROWS);
        for (int i = 0; i < count; i++) {
            AssetItemDto a = assets.get(i);
            int rowIdx = CepCellMapping.SOM_BIENS_ROWS[i];
            Row row = getOrCreateRow(sheet, rowIdx);

            if (a.getDesignation() != null) {
                setCellValue(getOrCreateCell(row, CepCellMapping.SOM_COL_BIEN_DESIGNATION), a.getDesignation());
            }
            if (a.getDetailOrValue() != null) {
                setCellValue(getOrCreateCell(row, CepCellMapping.SOM_COL_BIEN_VALEUR), a.getDetailOrValue());
            }
        }
    }

    private void fillClients(Sheet sheet, List<ClientItemDto> clients, String observations) {
        if (clients != null) {
            int count = Math.min(clients.size(), CepCellMapping.SOM_CLIENTS_MAX_ROWS);
            for (int i = 0; i < count; i++) {
                ClientItemDto c = clients.get(i);
                int rowIdx = CepCellMapping.SOM_CLIENTS_ROWS[i];
                Row row = getOrCreateRow(sheet, rowIdx);

                if (c.getClientName() != null) {
                    setCellValue(getOrCreateCell(row, CepCellMapping.SOM_COL_CLIENT_NOM), c.getClientName());
                }
                if (c.getTurnoverN1() != null) {
                    setCellValue(getOrCreateCell(row, CepCellMapping.SOM_COL_CLIENT_CA_N1), c.getTurnoverN1());
                }
                if (c.getPaymentTerms() != null) {
                    setCellValue(getOrCreateCell(row, CepCellMapping.SOM_COL_CLIENT_DELAI_REG), c.getPaymentTerms());
                }
            }
        }
        if (observations != null && !observations.isBlank()) {
            Row obsRow = getOrCreateRow(sheet, CepCellMapping.SOM_ROW_CLIENTS_OBS);
            setCellValue(getOrCreateCell(obsRow, CepCellMapping.SOM_COL_CLIENTS_OBS), observations);
        }
    }

    private void fillFournisseurs(Sheet sheet, List<SupplierItemDto> suppliers, String observations) {
        if (suppliers != null) {
            int count = Math.min(suppliers.size(), CepCellMapping.SOM_FOURNISSEURS_MAX_ROWS);
            for (int i = 0; i < count; i++) {
                SupplierItemDto s = suppliers.get(i);
                int rowIdx = CepCellMapping.SOM_FOURNISSEURS_ROWS[i];
                Row row = getOrCreateRow(sheet, rowIdx);

                if (s.getSupplierName() != null) {
                    setCellValue(getOrCreateCell(row, CepCellMapping.SOM_COL_FOURNISSEUR_NOM), s.getSupplierName());
                }
                if (s.getProduct() != null) {
                    setCellValue(getOrCreateCell(row, CepCellMapping.SOM_COL_FOURNISSEUR_PRODUIT), s.getProduct());
                }
                if (s.getPaymentTerms() != null) {
                    setCellValue(getOrCreateCell(row, CepCellMapping.SOM_COL_FOURNISSEUR_DELAI), s.getPaymentTerms());
                }
            }
        }
        if (observations != null && !observations.isBlank()) {
            Row obsRow = getOrCreateRow(sheet, CepCellMapping.SOM_ROW_FOURNISSEURS_OBS);
            setCellValue(getOrCreateCell(obsRow, CepCellMapping.SOM_COL_FOURNISSEURS_OBS), observations);
        }
    }

    // =========================================================================
    // REMPLISSAGE CHECKLIST
    // =========================================================================
    private void fillChecklist(Workbook workbook, List<String> providedDocNames) {
        if (providedDocNames == null || providedDocNames.isEmpty()) {
            return;
        }
        Sheet sheet = workbook.getSheet(CepCellMapping.SHEET_CHECKLIST);
        if (sheet == null) return;

        DataFormatter df = new DataFormatter();
        for (int r = 10; r <= 35; r++) { // Rows 11 to 36 in Excel
            Row row = sheet.getRow(r);
            if (row == null) continue;
            Cell labelCell = row.getCell(3); // Col D
            if (labelCell == null) continue;
            String label = df.formatCellValue(labelCell).toLowerCase();
            if (label.isBlank()) continue;

            boolean matched = false;
            for (String docName : providedDocNames) {
                if (docName == null) continue;
                String dLower = docName.toLowerCase();
                if (dLower.contains("ninea") && label.contains("ninea")) matched = true;
                else if (dLower.contains("rccm") && label.contains("rccm")) matched = true;
                else if ((dLower.contains("cni") || dLower.contains("identité")) && label.contains("cni")) matched = true;
                else if (dLower.contains("financier") && label.contains("financier")) matched = true;
                else if (dLower.contains("relevé") && label.contains("relevé")) matched = true;
                else if (dLower.contains("pro forma") && label.contains("pro forma")) matched = true;
                else if (dLower.contains("contrat") && label.contains("contrat")) matched = true;
            }

            if (matched) {
                Cell statusCell = getOrCreateCell(row, 4); // Col E
                statusCell.setCellValue("Oui");
            }
        }
    }

    // =========================================================================
    // UTILITAIRES CELLULES
    // =========================================================================
    private void writeCell(Sheet sheet, CepCellMapping.SingleCellTarget target, Object value) {
        if (value == null) {
            return; // Données absentes : ne pas écraser ni inventer de valeur
        }
        Row row = getOrCreateRow(sheet, target.getRowIndex());
        Cell cell = getOrCreateCell(row, target.getColumnIndex());

        // Vérification de sécurité : ne jamais écraser une formule existante
        if (cell.getCellType() == CellType.FORMULA) {
            log.warn("La cellule cible {} contient une formule (={}). Écriture ignorée pour préserver le calcul.",
                    target.getCellRef(), cell.getCellFormula());
            return;
        }

        if (value instanceof Number num) {
            setCellValue(cell, num.doubleValue());
        } else if (value instanceof String str) {
            if (!str.trim().isEmpty()) {
                setCellValue(cell, str.trim());
            }
        } else {
            setCellValue(cell, value.toString());
        }
    }

    private void setCellValue(Cell cell, String val) {
        cell.setCellValue(val);
    }

    private void setCellValue(Cell cell, double val) {
        cell.setCellValue(val);
    }

    private Row getOrCreateRow(Sheet sheet, int rowIndex) {
        Row row = sheet.getRow(rowIndex);
        return row != null ? row : sheet.createRow(rowIndex);
    }

    private Cell getOrCreateCell(Row row, int colIndex) {
        Cell cell = row.getCell(colIndex);
        return cell != null ? cell : row.createCell(colIndex);
    }

    private String firstNonBlank(String... values) {
        for (String v : values) {
            if (v != null && !v.isBlank()) {
                return v.trim();
            }
        }
        return null;
    }

    private void validateGeneratedWorkbook(byte[] bytes) {
        try (InputStream bais = new ByteArrayInputStream(bytes);
             Workbook testWb = new XSSFWorkbook(bais)) {
            if (testWb.getNumberOfSheets() != CepCellMapping.EXPECTED_SHEET_COUNT) {
                log.warn("Auto-contrôle : le classeur généré contient {} feuilles sur {}.",
                        testWb.getNumberOfSheets(), CepCellMapping.EXPECTED_SHEET_COUNT);
            }
        } catch (Exception e) {
            throw new InternalError("Échec du contrôle d'intégrité du classeur généré: " + e.getMessage());
        }
    }
}
