package sn.finawa.service.cep;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * Cartographie centralisée, documentée et vérifiée des champs du formulaire
 * vers les cellules de saisie du classeur Excel original 'CEP Modèle.xlsx'.
 */
public final class CepCellMapping {

    private CepCellMapping() {
    }

    // Nom des feuilles de destination
    public static final String SHEET_LANDING_PAGE = "Landing Page";
    public static final String SHEET_SOMMAIRE = "Sommaire";
    public static final String SHEET_CHECKLIST = "Checklist";

    public static final int EXPECTED_SHEET_COUNT = 16;

    public static final String[] EXPECTED_SHEETS = {
            "Landing Page",
            "Sommaire",
            "Checklist",
            "Hypotheses",
            "Estimation des autres charges",
            "OPEX",
            "Amort_Immobilisation",
            "TA _Invest",
            "TA _Exploitation",
            "Feuil1",
            "CEP",
            "Plan tréso",
            "Cashflow",
            "Données_Graph",
            "GRAPH",
            "Equilibre"
    };

    /**
     * Définition d'un point d'injection unitaire dans une cellule.
     */
    @Getter
    @RequiredArgsConstructor
    public static class SingleCellTarget {
        private final String fieldId;
        private final String label;
        private final String sheetName;
        private final int rowIndex;      // 0-indexed (POI)
        private final int columnIndex;   // 0-indexed (POI)
        private final String cellRef;    // e.g. "E7"
        private final boolean merged;
        private final String mergedRange;
        private final DataType dataType;

        public enum DataType {
            STRING, NUMERIC, PERCENTAGE, YEAR
        }
    }

    // =========================================================================
    // CELLULES DE LA FEUILLE 'Landing Page'
    // =========================================================================
    public static final SingleCellTarget LP_NOM_STRUCTURE = new SingleCellTarget(
            "enterprise.legalName", "Nom de la structure", SHEET_LANDING_PAGE, 6, 4, "E7", true, "E7:F7", SingleCellTarget.DataType.STRING);

    public static final SingleCellTarget LP_SECTEUR_ACTIVITES = new SingleCellTarget(
            "enterprise.sector", "Secteur d'activités", SHEET_LANDING_PAGE, 8, 4, "E9", true, "E9:F9", SingleCellTarget.DataType.STRING);

    public static final SingleCellTarget LP_CA_ESTIME = new SingleCellTarget(
            "financial.currentYearEstimatedTurnover", "Chiffres d'affaires estimé", SHEET_LANDING_PAGE, 10, 4, "E11", true, "E11:F11", SingleCellTarget.DataType.NUMERIC);

    public static final SingleCellTarget LP_MONTANT_SOUHAITE = new SingleCellTarget(
            "financing.desiredAmount", "Montant souhaité", SHEET_LANDING_PAGE, 12, 4, "E13", true, "E13:F13", SingleCellTarget.DataType.NUMERIC);

    public static final SingleCellTarget LP_MONTANT_PRECIS = new SingleCellTarget(
            "financing.exactAmount", "Montant précis", SHEET_LANDING_PAGE, 14, 4, "E15", true, "E15:F15", SingleCellTarget.DataType.NUMERIC);

    public static final SingleCellTarget LP_NATURE_BESOIN = new SingleCellTarget(
            "financing.needType", "Nature du besoin", SHEET_LANDING_PAGE, 16, 4, "E17", false, null, SingleCellTarget.DataType.STRING);

    public static final SingleCellTarget LP_ANCIENNETE = new SingleCellTarget(
            "enterprise.seniority", "Ancienneté", SHEET_LANDING_PAGE, 18, 4, "E19", false, null, SingleCellTarget.DataType.STRING);

    public static final SingleCellTarget LP_EMPLOYES = new SingleCellTarget(
            "enterprise.employees", "Employés", SHEET_LANDING_PAGE, 20, 4, "E21", false, null, SingleCellTarget.DataType.NUMERIC);

    public static final SingleCellTarget LP_VILLE_ZONE = new SingleCellTarget(
            "enterprise.cityZone", "Ville / Zone", SHEET_LANDING_PAGE, 22, 4, "E23", false, null, SingleCellTarget.DataType.STRING);

    // Contacts Landing Page (Colonne K, en face des libellés en I)
    public static final SingleCellTarget LP_DIRIGEANT = new SingleCellTarget(
            "enterprise.managerName", "Dirigeant", SHEET_LANDING_PAGE, 6, 10, "K7", false, null, SingleCellTarget.DataType.STRING);

    public static final SingleCellTarget LP_TELEPHONE = new SingleCellTarget(
            "enterprise.phone", "Téléphone", SHEET_LANDING_PAGE, 8, 10, "K9", false, null, SingleCellTarget.DataType.STRING);

    public static final SingleCellTarget LP_EMAIL = new SingleCellTarget(
            "enterprise.email", "Email", SHEET_LANDING_PAGE, 10, 10, "K11", false, null, SingleCellTarget.DataType.STRING);

    public static final SingleCellTarget LP_PREFERENCE_APPEL = new SingleCellTarget(
            "financing.contactPreference", "Préférence d'appel", SHEET_LANDING_PAGE, 12, 10, "K13", false, null, SingleCellTarget.DataType.STRING);

    public static final SingleCellTarget LP_URGENCE = new SingleCellTarget(
            "financing.urgency", "Urgence", SHEET_LANDING_PAGE, 14, 10, "K15", false, null, SingleCellTarget.DataType.STRING);

    public static final SingleCellTarget LP_SOURCE = new SingleCellTarget(
            "financing.source", "Source d'informations", SHEET_LANDING_PAGE, 16, 10, "K17", false, null, SingleCellTarget.DataType.STRING);

    // =========================================================================
    // CELLULES DE LA FEUILLE 'Sommaire' — Section Données Générales
    // =========================================================================
    public static final SingleCellTarget SOM_NOM_STRUCTURE = new SingleCellTarget(
            "enterprise.legalName", "Nom de la structure", SHEET_SOMMAIRE, 11, 4, "E12", false, null, SingleCellTarget.DataType.STRING);

    public static final SingleCellTarget SOM_ANNEE_CREATION = new SingleCellTarget(
            "enterprise.creationYear", "Année de création", SHEET_SOMMAIRE, 13, 4, "E14", false, null, SingleCellTarget.DataType.YEAR);

    public static final SingleCellTarget SOM_FORME_JURIDIQUE = new SingleCellTarget(
            "enterprise.legalForm", "Forme juridique", SHEET_SOMMAIRE, 15, 4, "E16", true, "E16:F16", SingleCellTarget.DataType.STRING);

    public static final SingleCellTarget SOM_ACTIVITE_PRINCIPALE = new SingleCellTarget(
            "enterprise.mainActivity", "Activité principale", SHEET_SOMMAIRE, 17, 4, "E18", false, null, SingleCellTarget.DataType.STRING);

    public static final SingleCellTarget SOM_ADRESSE = new SingleCellTarget(
            "enterprise.address", "Adresse", SHEET_SOMMAIRE, 19, 4, "E20", false, null, SingleCellTarget.DataType.STRING);

    public static final SingleCellTarget SOM_VILLE = new SingleCellTarget(
            "enterprise.city", "Ville", SHEET_SOMMAIRE, 21, 4, "E22", false, null, SingleCellTarget.DataType.STRING);

    public static final SingleCellTarget SOM_POINT_FOCAL = new SingleCellTarget(
            "enterprise.focalPointName", "Point focal", SHEET_SOMMAIRE, 23, 4, "E24", false, null, SingleCellTarget.DataType.STRING);

    public static final SingleCellTarget SOM_FONCTION_POINT_FOCAL = new SingleCellTarget(
            "enterprise.focalPointRole", "Fonction", SHEET_SOMMAIRE, 25, 4, "E26", false, null, SingleCellTarget.DataType.STRING);

    public static final SingleCellTarget SOM_TELEPHONE = new SingleCellTarget(
            "enterprise.phone", "Tel", SHEET_SOMMAIRE, 27, 4, "E28", false, null, SingleCellTarget.DataType.STRING);

    public static final SingleCellTarget SOM_EMAIL = new SingleCellTarget(
            "enterprise.email", "Email", SHEET_SOMMAIRE, 29, 4, "E30", false, null, SingleCellTarget.DataType.STRING);

    // =========================================================================
    // CELLULES DE LA FEUILLE 'Sommaire' — Section Système Comptable
    // =========================================================================
    public static final SingleCellTarget SOM_DERNIER_EXERCICE = new SingleCellTarget(
            "financial.lastClosedExercise", "Dernier exercice clôturé", SHEET_SOMMAIRE, 33, 4, "E34", true, "E34:F34", SingleCellTarget.DataType.STRING);

    public static final SingleCellTarget SOM_ETATS_FINANCIERS_CERTIFIES = new SingleCellTarget(
            "financial.certifiedStatements", "États financiers certifiés", SHEET_SOMMAIRE, 35, 4, "E36", true, "E36:F36", SingleCellTarget.DataType.STRING);

    public static final SingleCellTarget SOM_CABINET_COMPTABLE = new SingleCellTarget(
            "financial.accountingAssistanceFirm", "Cabinet d'assistance comptable", SHEET_SOMMAIRE, 37, 4, "E38", true, "E38:F38", SingleCellTarget.DataType.STRING);

    public static final SingleCellTarget SOM_COMMISSAIRE_COMPTES = new SingleCellTarget(
            "financial.statutoryAuditor", "Commissaire aux comptes", SHEET_SOMMAIRE, 39, 4, "E40", true, "E40:F40", SingleCellTarget.DataType.STRING);

    // =========================================================================
    // TABLEAUX RÉPÉTITIFS 'Sommaire'
    // =========================================================================

    // 1. Actionnariat : 4 lignes autorisées (D47:F47, D55:F55, D57:F57, D59:F59)
    // Note: F65 (=F47+F55+F57+F59) et G65 (Contrôle 100%) NE DOIVENT PAS ÊTRE TOUCHÉS
    public static final int[] SOM_ACTIONNARIAT_ROWS = {46, 54, 56, 58}; // 0-indexed -> Excel rows 47, 55, 57, 59
    public static final int SOM_ACTIONNARIAT_MAX_ROWS = 4;
    public static final int SOM_COL_PRENOM = 3;  // Col D
    public static final int SOM_COL_NOM = 4;     // Col E
    public static final int SOM_COL_POURCENT = 5;// Col F

    // 2. Management : 7 lignes autorisées (Excel rows 71, 73, 75, 77, 79, 81, 83)
    public static final int[] SOM_MANAGEMENT_ROWS = {70, 72, 74, 76, 78, 80, 82};
    public static final int SOM_MANAGEMENT_MAX_ROWS = 7;
    public static final int SOM_COL_FONCTION_EXP = 5; // Col F
    public static final int SOM_ROW_ORGANIGRAMME_OBS = 84; // Excel row 85 (Merged D85:F88)
    public static final int SOM_COL_ORGANIGRAMME_OBS = 3;  // Col D

    // 3. Historique de l'entreprise : zone fusionnée D92:F101
    public static final int SOM_ROW_HISTORIQUE = 91; // Excel row 92
    public static final int SOM_COL_HISTORIQUE = 3;  // Col D

    // 4. Relations bancaires : 4 lignes (Excel rows 107, 109, 111, 113)
    public static final int[] SOM_BANQUE_ROWS = {106, 108, 110, 112};
    public static final int SOM_BANQUE_MAX_ROWS = 4;
    public static final int SOM_COL_BANQUE = 3;          // Col D
    public static final int SOM_COL_ENGAGEMENT = 4;      // Col E
    public static final int SOM_COL_NUM_COMPTE = 5;      // Col F

    // Coordonnées agence (Excel row 119)
    public static final int SOM_ROW_AGENCE = 118; // Excel row 119
    public static final int SOM_COL_AGENCE_NOM = 3;   // Col D
    public static final int SOM_COL_AGENCE_TEL = 4;   // Col E
    public static final int SOM_COL_AGENCE_EMAIL = 5; // Col F
    // Observations bancaires (Excel row 123, Merged D123:F127)
    public static final int SOM_ROW_BANQUE_OBS = 122; // Excel row 123
    public static final int SOM_COL_BANQUE_OBS = 3;   // Col D

    // 5. Activités / Produits : 5 lignes (Excel rows 133, 135, 137, 139, 141)
    public static final int[] SOM_ACTIVITES_ROWS = {132, 134, 136, 138, 140};
    public static final int SOM_ACTIVITES_MAX_ROWS = 5;
    public static final int SOM_COL_PRODUIT_NOM = 3;   // Col D
    public static final int SOM_COL_PART_CA_N1 = 4;    // Col E
    public static final int SOM_COL_PART_CA_N2 = 5;    // Col F

    // 6. Liste des biens : 4 lignes (Excel rows 145, 147, 149, 151)
    public static final int[] SOM_BIENS_ROWS = {144, 146, 148, 150};
    public static final int SOM_BIENS_MAX_ROWS = 4;
    public static final int SOM_COL_BIEN_DESIGNATION = 3; // Col D
    public static final int SOM_COL_BIEN_VALEUR = 4;      // Col E (Merged E:F)

    // 7. Principaux clients : 4 lignes (Excel rows 157, 159, 161, 163)
    public static final int[] SOM_CLIENTS_ROWS = {156, 158, 160, 162};
    public static final int SOM_CLIENTS_MAX_ROWS = 4;
    public static final int SOM_COL_CLIENT_NOM = 3;        // Col D
    public static final int SOM_COL_CLIENT_CA_N1 = 4;      // Col E
    public static final int SOM_COL_CLIENT_DELAI_REG = 5;  // Col F
    public static final int SOM_ROW_CLIENTS_OBS = 165;     // Excel row 166 (Merged D166:F169)
    public static final int SOM_COL_CLIENTS_OBS = 3;       // Col D

    // 8. Principaux fournisseurs : 4 lignes (Excel rows 175, 177, 179, 181)
    public static final int[] SOM_FOURNISSEURS_ROWS = {174, 176, 178, 180};
    public static final int SOM_FOURNISSEURS_MAX_ROWS = 4;
    public static final int SOM_COL_FOURNISSEUR_NOM = 3;     // Col D
    public static final int SOM_COL_FOURNISSEUR_PRODUIT = 4; // Col E
    public static final int SOM_COL_FOURNISSEUR_DELAI = 5;   // Col F
    public static final int SOM_ROW_FOURNISSEURS_OBS = 183;  // Excel row 184 (Merged D184:F190)
    public static final int SOM_COL_FOURNISSEURS_OBS = 3;    // Col D
}
