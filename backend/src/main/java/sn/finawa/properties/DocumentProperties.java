package sn.finawa.properties;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;
import org.springframework.validation.annotation.Validated;

import jakarta.validation.constraints.NotEmpty;
import java.util.Arrays;
import java.util.List;

@Validated
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@Component
@ConfigurationProperties(prefix = "storage-document")
public class DocumentProperties {


    List<String> acceptFileExtensions = Arrays
            .asList(
                    "application/pdf",                                                         // .pdf
                    "text/csv",                                                                // .csv
                    "application/vnd.ms-excel",                                                // .xls
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",       // .xlsx
                    "application/msword",                                                      // .doc
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
                    "image/jpeg",                                                              // .jpeg or .jpg
                    "image/png",                                                               // .png
                    "image/webp"                                                               // .webp
                    );


    @NotEmpty
    String fileStorageRootPath;
}
