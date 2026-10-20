package sn.finawa.repository;

import com.querydsl.core.BooleanBuilder;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.stereotype.Repository;
import sn.finawa.entity.QUserEntity;
import sn.finawa.entity.UserEntity;

import java.util.Map;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long>, QuerydslPredicateExecutor<UserEntity> {
    default Page<UserEntity> readAll(Map<String, String> searchParams, Pageable pageable) {
        var builder = new BooleanBuilder();
        var q = QUserEntity.userEntity;
        if (searchParams.containsKey("id")) {
            builder.and(q.id.eq(Long.valueOf(searchParams.get("id"))));
        }
        if (searchParams.containsKey("login")) {
            builder.and(q.login.containsIgnoreCase(searchParams.get("login")));
        }
        if (searchParams.containsKey("active")) {
            builder.and(q.active.eq(Boolean.valueOf(searchParams.get("active"))));
        }
        if (searchParams.containsKey("profileId")) {
            builder.and(q.profile.id.eq(Long.valueOf(searchParams.get("profileId"))));
        }
        return findAll(builder, pageable);
    }

    Optional<UserEntity> findByLogin(String login);

    boolean existsByLogin(@NotBlank @Email(message = "Please enter a valid email address") String login);
}
