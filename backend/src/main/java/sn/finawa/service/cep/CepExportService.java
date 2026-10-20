package sn.finawa.service.cep;

import org.springframework.core.io.Resource;
import sn.finawa.dto.form.DossierFormData;
import sn.finawa.entity.DossierEntity;

import java.io.OutputStream;
import java.util.List;

public interface CepExportService {

    /**
     * Génère une copie préremplie du classeur original CEP Modèle.xlsx
     * pour le dossier donné et écrit le flux dans l'OutputStream fourni.
     */
    void generateCepWorkbook(DossierEntity dossier, DossierFormData formData, List<String> providedDocNames, OutputStream outputStream);

    /**
     * Génère le classeur et retourne la ressource en mémoire ainsi que le nom de fichier suggéré.
     */
    CepExportResult exportCep(DossierEntity dossier, DossierFormData formData, List<String> providedDocNames);

    record CepExportResult(Resource resource, String filename, long contentLength) {}
}
