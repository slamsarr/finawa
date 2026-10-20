package sn.finawa.service.impl;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StreamUtils;
import sn.finawa.annotation.Journal;
import sn.finawa.aspect.ActionType;
import sn.finawa.exception.InternalError;
import sn.finawa.exception.ResourceNotFoundException;
import sn.finawa.properties.DocumentProperties;
import sn.finawa.service.StorageService;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.MalformedURLException;
import java.nio.file.*;
import java.time.LocalDate;
import java.util.UUID;

@Slf4j
@Service
@Transactional
@FieldDefaults(level = AccessLevel.PRIVATE)
public class StorageServiceImpl implements StorageService {

    private final DocumentProperties documentProperties;
    private final Path rootPath;

    public StorageServiceImpl(DocumentProperties properties) {
        this.documentProperties = properties;
        this.rootPath = Paths.get(this.documentProperties.getFileStorageRootPath());
    }


    @Override
    public String storeFile(InputStream inputStream, String originalFileName) {
        LocalDate today = LocalDate.now();
        Path dir = rootPath.resolve(
                today.getYear() + File.separator +
                        String.format("%02d", today.getMonthValue()) + File.separator +
                        String.format("%02d", today.getDayOfMonth())
        );

        try {
            Files.createDirectories(dir);
        } catch (IOException e) {
            throw new InternalError("An error occurred while saving the file");
        }

        String ext = getFileExtension(originalFileName);
        String storedName = UUID.randomUUID() + (ext.isEmpty() ? "" : "." + ext);
        Path filePath = dir.resolve(storedName);

        try (OutputStream outputStream = Files.newOutputStream(filePath, StandardOpenOption.CREATE_NEW)) {
            StreamUtils.copy(inputStream, outputStream);
        } catch (IOException e) {
            throw new InternalError("An error occurred while saving the file");
        }

        return rootPath.relativize(filePath).toString().replace('\\', '/');
    }

    @Override
    public Resource getFile(String relativePath) {
        Path filePath = rootPath.resolve(relativePath).normalize().toAbsolutePath();
        Path normalizedRoot = rootPath.normalize().toAbsolutePath();

        if (!filePath.startsWith(normalizedRoot)) {
            throw new SecurityException("Unauthorized access to filesystem path");
        }

        if (!Files.exists(filePath)) {
            throw new ResourceNotFoundException("File not found with path : " + filePath);
        }

        try {
            return new UrlResource(filePath.toUri());
        } catch (MalformedURLException e) {
            throw new InternalError("An error occurred during retrieval of file");
        }
    }

    @Override
    @Journal(actionType = ActionType.DELETE_FILE_ATTEMPT)
    public void deleteFile(String relativePath) {
        Path filePath = rootPath.resolve(relativePath).normalize().toAbsolutePath();
        Path normalizedRoot = rootPath.normalize().toAbsolutePath();

        if (!filePath.startsWith(normalizedRoot)) {
            throw new SecurityException("Unauthorized access to filesystem path");
        }

        try {
            boolean deleted = Files.deleteIfExists(filePath);
            if (!deleted) {
                throw new ResourceNotFoundException("The file you're attempting to delete does not exist");
            }
        } catch (IOException e) {
            throw new InternalError("An error occurred during file deletion");
        }
    }

    private String getFileExtension(String fileName) {
        int lastDot = fileName.lastIndexOf('.');
        return lastDot == -1 ? "" : fileName.substring(lastDot + 1);
    }
}
