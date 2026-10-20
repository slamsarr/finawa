package sn.finawa.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import sn.finawa.annotation.Journal;
import sn.finawa.dto.DocumentCreateRequest;
import sn.finawa.dto.DocumentResponse;
import sn.finawa.dto.DocumentUpdateRequest;
import sn.finawa.entity.DocumentEntity;
import sn.finawa.exception.InternalError;
import sn.finawa.exception.UnauthorizedException;
import sn.finawa.entity.enums.ReferentialType;
import sn.finawa.exception.ResourceAlreadyExistException;
import sn.finawa.exception.ResourceNotFoundException;
import sn.finawa.mapper.DocumentMapper;
import sn.finawa.properties.DocumentProperties;
import sn.finawa.repository.DocumentRepository;
import sn.finawa.repository.UserRepository;
import sn.finawa.security.SecurityUtils;
import sn.finawa.service.StorageService;
import sn.finawa.service.DocumentService;
import sn.finawa.utility.LabelResolver;
import sn.finawa.aspect.ActionType;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Map;

// TODO : Allow the change of owner from the admin section in case you want to manually
//  add documents for someone who couldn't use the platform for some reason

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class DocumentServiceImpl implements DocumentService {

    private final LabelResolver labelResolver;
    private final DocumentRepository documentRepository;
    private final DocumentMapper documentMapper;
    private final StorageService storageService;
    private final UserRepository userRepository;
    private final DocumentProperties documentProperties;

    private static final String DOCUMENT_ID_NOT_FOUND_MESSAGE = "Document not found with id : ";
    private static final String DOCUMENT_NAME_ALREADY_EXISTS_MESSAGE = "A document with the same name already exists : ";

    @Override
    @Journal(actionType = ActionType.ADD_DOCUMENT)
    public DocumentResponse create(DocumentCreateRequest dto, MultipartFile file) {
        validateFile(file);
        var currentUserLogin = SecurityUtils.getCurrentUserLogin();
        if (currentUserLogin.isEmpty()) {
            throw new UnauthorizedException("No login info found");
        }
        var owner = userRepository.findByLogin(currentUserLogin.get())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with login"));
        if (documentRepository.existsByName(dto.getName())) {
            throw new ResourceAlreadyExistException(DOCUMENT_NAME_ALREADY_EXISTS_MESSAGE + dto.getName());
        }
        var docTypeLabel = labelResolver.getLabel(dto.getDocumentTypeId(), ReferentialType.DOCUMENT_TYPE);

        String originalFilename = (file.getOriginalFilename() != null && !file.getOriginalFilename().isBlank())
                ? file.getOriginalFilename()
                : dto.getName();

        String filePath;
        try (var inputStream = file.getInputStream()) {
            filePath = storageService.storeFile(inputStream, originalFilename);
        } catch (IOException e) {
            log.error("Failed to read uploaded file stream", e);
            throw new InternalError("Failed to read uploaded file");
        }

        var doc = DocumentEntity
                .builder()
                .owner(owner)
                .name(dto.getName())
                .description(dto.getDescription())
                .documentType(docTypeLabel)
                .storedName(filePath)
                .size(file.getSize())
                .extension(file.getContentType())
                .uploadDate(LocalDateTime.now())
                .build();

        return documentMapper.asDto(documentRepository.save(doc));
    }

    @Override
    @Journal(actionType = ActionType.UPDATE_DOCUMENT)
    public DocumentResponse update(DocumentUpdateRequest dto, MultipartFile file) {
        var doc = documentRepository
                .findById(dto.getId())
                .orElseThrow(() -> new ResourceNotFoundException(DOCUMENT_ID_NOT_FOUND_MESSAGE + dto.getId()));

        if (!doc.getName().equals(dto.getName()) && documentRepository.existsByName(dto.getName())) {
            throw new ResourceAlreadyExistException(DOCUMENT_NAME_ALREADY_EXISTS_MESSAGE + dto.getName());
        }

        if (!doc.getDocumentType().getId().equals(dto.getDocumentTypeId())) {
            var newTypeLabel = labelResolver.getLabel(dto.getDocumentTypeId(), ReferentialType.DOCUMENT_TYPE);
            doc.setDocumentType(newTypeLabel);
        }

        if (file != null && !file.isEmpty()) {
            validateFile(file);

            if (doc.getStoredName() != null) {
                try {
                    storageService.deleteFile(doc.getStoredName());
                } catch (Exception e) {
                    log.warn("Could not delete previous file path: {}", doc.getStoredName(), e);
                }
            }

            String originalFilename = (file.getOriginalFilename() != null && !file.getOriginalFilename().isBlank())
                    ? file.getOriginalFilename()
                    : dto.getName();

            String filePath;
            try (var inputStream = file.getInputStream()) {
                filePath = storageService.storeFile(inputStream, originalFilename);
            } catch (IOException e) {
                log.error("Failed to read uploaded file stream", e);
                throw new InternalError("Failed to read uploaded file");
            }

            doc.setStoredName(filePath);
            doc.setSize(file.getSize());
            doc.setExtension(file.getContentType());
            doc.setUploadDate(LocalDateTime.now());
        }

        doc.setName(dto.getName());
        doc.setDescription(dto.getDescription());
        doc = documentRepository.save(doc);
        return documentMapper.asDto(doc);
    }

    @Override
    public DocumentResponse read(Long id) {
        var doc = documentRepository
                .findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(DOCUMENT_ID_NOT_FOUND_MESSAGE + id));
        return documentMapper.asDto(doc);
    }

    @Override
    public Page<DocumentResponse> readAll(Map<String, String> searchParams, Pageable pageable) {
        return documentRepository
                .readAll(searchParams, pageable)
                .map(documentMapper::asDto);
    }

    @Override
    @Journal(actionType = ActionType.DELETE_DOCUMENT)
    public void delete(Long id) {
        var doc = documentRepository
                .findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(DOCUMENT_ID_NOT_FOUND_MESSAGE + id));
        if (doc.getStoredName() != null) {
            try {
                storageService.deleteFile(doc.getStoredName());
            } catch (Exception e) {
                log.warn("Could not delete file from disk during document deletion: {}", doc.getStoredName(), e);
            }
        }
        documentRepository.delete(doc);
    }

    @Override
    public Resource downloadFile(Long id) {
        var doc = documentRepository
                .findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(DOCUMENT_ID_NOT_FOUND_MESSAGE + id));
        if (doc.getStoredName() == null) {
            throw new ResourceNotFoundException("No file associated with this document");
        }
        return storageService.getFile(doc.getStoredName());
    }

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File is empty.");
        }
        // Validate file extension against allowed configuration
        String ext = file.getContentType();
        if (ext == null || !documentProperties.getAcceptFileExtensions().contains(ext.toLowerCase())) {
            throw new IllegalArgumentException("File type not accepted: " + ext);
        }
    }
}
