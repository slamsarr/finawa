package sn.finawa.service;

import org.springframework.core.io.Resource;
import java.io.InputStream;

public interface StorageService {

    String storeFile(InputStream inputStream, String originalFileName);

    Resource getFile(String relativePath);

    void deleteFile(String relativePath);

}
