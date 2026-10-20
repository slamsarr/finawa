package sn.finawa.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaTypeFactory;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import sn.finawa.dto.DocumentCreateRequest;
import sn.finawa.dto.DocumentResponse;
import sn.finawa.dto.DocumentUpdateRequest;
import sn.finawa.dto.helper.Response;
import sn.finawa.service.DocumentService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(value = "/documents", produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = "Document")
@RequiredArgsConstructor
public class DocumentController {

    private final DocumentService documentService;

    @Operation(summary = "Create document with file upload")
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Response<DocumentResponse>> createDocument(
            @RequestPart(value = "file", required = true) MultipartFile file,
            @RequestPart("document") @Valid DocumentCreateRequest dto) {
        return Response.created(documentService.create(dto, file));
    }

    @Operation(summary = "Update document details and/or file")
    @PatchMapping(value = "/{documentId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Response<DocumentResponse>> updateDocument(
            @PathVariable Long documentId,
            @RequestPart(value = "file", required = false) MultipartFile file,
            @RequestPart("document") @Valid DocumentUpdateRequest dto) {
        dto.setId(documentId);
        return Response.ok(documentService.update(dto, file));
    }

    @Operation(summary = "Delete document")
    @DeleteMapping("/{documentId}")
    public ResponseEntity<Response<Void>> deleteDocument(@PathVariable Long documentId) {
        documentService.delete(documentId);
        return Response.ok("Document Deleted Successfully");
    }

    @Operation(summary = "Read the document details")
    @GetMapping("/{documentId}")
    public ResponseEntity<Response<DocumentResponse>> readDocument(@PathVariable Long documentId) {
        return Response.ok(documentService.read(documentId));
    }

    @Operation(summary = "Read all documents")
    @GetMapping
    public ResponseEntity<Response<List<DocumentResponse>>> readAllDocuments(@RequestParam Map<String, String> searchParams, Pageable pageable) {
        return Response.ok(documentService.readAll(searchParams, pageable));
    }

    @Operation(summary = "Download document file")
    @GetMapping(value = "/{id}/_download", produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    public ResponseEntity<Resource> downloadDocumentFile(@PathVariable("id") Long id) {
        Resource fileResource = documentService.downloadFile(id);
        var doc = documentService.read(id);
        
        MediaType mediaType = MediaType.APPLICATION_OCTET_STREAM;
        if (doc.getExtension() != null && !doc.getExtension().isBlank()) {
            try {
                mediaType = MediaType.parseMediaType(doc.getExtension());
            } catch (Exception e) {
                mediaType = MediaTypeFactory.getMediaType(doc.getName()).orElse(MediaType.APPLICATION_OCTET_STREAM);
            }
        }

        String downloadFilename = doc.getName();
        if (fileResource.getFilename() != null && fileResource.getFilename().contains(".")) {
            String ext = fileResource.getFilename().substring(fileResource.getFilename().lastIndexOf("."));
            if (!downloadFilename.toLowerCase().endsWith(ext.toLowerCase())) {
                downloadFilename += ext;
            }
        }

        return ResponseEntity.ok()
                .contentType(mediaType)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + downloadFilename + "\"")
                .body(fileResource);
    }

    @Operation(summary = "View document file inline")
    @GetMapping(value = "/{id}/_view", produces = MediaType.ALL_VALUE)
    public ResponseEntity<Resource> viewDocumentFile(@PathVariable("id") Long id) {
        Resource fileResource = documentService.downloadFile(id);
        var doc = documentService.read(id);

        MediaType mediaType = MediaType.APPLICATION_OCTET_STREAM;
        if (doc.getExtension() != null && !doc.getExtension().isBlank()) {
            try {
                mediaType = MediaType.parseMediaType(doc.getExtension());
            } catch (Exception e) {
                mediaType = MediaTypeFactory.getMediaType(doc.getName()).orElse(MediaType.APPLICATION_OCTET_STREAM);
            }
        }

        String filename = doc.getName();
        if (fileResource.getFilename() != null && fileResource.getFilename().contains(".")) {
            String ext = fileResource.getFilename().substring(fileResource.getFilename().lastIndexOf("."));
            if (!filename.toLowerCase().endsWith(ext.toLowerCase())) {
                filename += ext;
            }
        }

        return ResponseEntity.ok()
                .contentType(mediaType)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + filename + "\"")
                .body(fileResource);
    }
}
