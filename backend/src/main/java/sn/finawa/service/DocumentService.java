package sn.finawa.service;

import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;
import sn.finawa.dto.DocumentCreateRequest;
import sn.finawa.dto.DocumentUpdateRequest;
import sn.finawa.dto.DocumentResponse;

import java.util.Map;

public interface DocumentService {

    DocumentResponse create(DocumentCreateRequest dto, MultipartFile file);

    DocumentResponse update(DocumentUpdateRequest dto, MultipartFile file);

    DocumentResponse read(Long id);

    Page<DocumentResponse> readAll(Map<String, String> searchParams, Pageable pageable);

    Resource downloadFile(Long id);

    void delete(Long id);
}
