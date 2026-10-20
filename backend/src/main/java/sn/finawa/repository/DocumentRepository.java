package sn.finawa.repository;

import com.querydsl.core.BooleanBuilder;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.stereotype.Repository;
import sn.finawa.entity.DocumentEntity;
import sn.finawa.entity.QDocumentEntity;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@Repository
public interface DocumentRepository extends JpaRepository<DocumentEntity, Long>, QuerydslPredicateExecutor<DocumentEntity> {

    default Page<DocumentEntity> readAll(Map<String, String> searchParams, Pageable pageable) {
        var builder = new BooleanBuilder();
        var q = QDocumentEntity.documentEntity;
        if (searchParams.containsKey("id")) {
            builder.and(q.id.eq(Long.valueOf(searchParams.get("id"))));
        }
        if (searchParams.containsKey("name")) {
            builder.and(q.name.containsIgnoreCase(searchParams.get("name")));
        }
        if (searchParams.containsKey("storedName")) {
            builder.and(q.storedName.containsIgnoreCase(searchParams.get("storedName")));
        }
        if (searchParams.containsKey("extension")) {
            builder.and(q.extension.containsIgnoreCase(searchParams.get("extension")));
        }
        if (searchParams.containsKey("description")) {
            builder.and(q.description.containsIgnoreCase(searchParams.get("description")));
        }
        // TODO : For some reason this filter causes the result to always be empty.
//        if (searchParams.containsKey("size")) {
//            builder.and(q.size.eq(Long.parseLong(searchParams.get("size"))));
//        }
        if (searchParams.containsKey("uploadDate")) {
            builder.and(q.uploadDate.before(LocalDateTime.parse(searchParams.get("uploadDate"))));
        }
        if (searchParams.containsKey("documentTypeId")) {
            builder.and(q.documentType.id.eq(Long.valueOf(searchParams.get("documentTypeId"))));
        }
        if (searchParams.containsKey("owner")) {
            builder.and(q.owner.login.containsIgnoreCase(searchParams.get("owner")));
        }
        return findAll(builder, pageable);
    }

    boolean existsByName(@NotBlank String name);

    Optional<DocumentEntity> findByName(@NotBlank String name);
}
