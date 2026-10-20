package sn.finawa.repository;

import com.querydsl.core.BooleanBuilder;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.stereotype.Repository;
import sn.finawa.entity.ProfileEntity;
import sn.finawa.entity.QProfileEntity;

import java.util.Map;
import java.util.Optional;

@Repository
public interface ProfileRepository extends JpaRepository<ProfileEntity, Long>, QuerydslPredicateExecutor<ProfileEntity> {
    default Page<ProfileEntity> readAll(Map<String, String> searchParams, Pageable pageable) {
        var builder = new BooleanBuilder();
        var q = QProfileEntity.profileEntity;
        if (searchParams.containsKey("id")) {
            builder.and(q.id.eq(Long.valueOf(searchParams.get("id"))));
        }
        if (searchParams.containsKey("name")) {
            builder.and(q.name.containsIgnoreCase(searchParams.get("name")));
        }
        if (searchParams.containsKey("description")) {
            builder.and(q.description.containsIgnoreCase(searchParams.get("description")));
        }
        if (searchParams.containsKey("permission")) {
            builder.and(q.permissions.contains(searchParams.get("permission")));
        }
        return findAll(builder, pageable);
    }

    boolean existsByName(@NotBlank String name);
    boolean existsByNameAndIdNot(@NotBlank String name, Long id);
    Optional<ProfileEntity> findByName(String name);
}
