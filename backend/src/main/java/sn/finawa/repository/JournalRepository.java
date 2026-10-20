package sn.finawa.repository;

import com.querydsl.core.BooleanBuilder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.stereotype.Repository;
import sn.finawa.entity.JournalEntity;
import sn.finawa.entity.QJournalEntity;

import java.time.LocalDateTime;
import java.util.Map;

@Repository
public interface JournalRepository extends JpaRepository<JournalEntity, Long>, QuerydslPredicateExecutor<JournalEntity> {

    default Page<JournalEntity> readAll(Map<String, String> searchParams, Pageable pageable) {
        var builder = new BooleanBuilder();
        var q = QJournalEntity.journalEntity;
        if (searchParams.containsKey("id")) {
            builder.and(q.id.eq(Long.valueOf(searchParams.get("id"))));
        }
        if (searchParams.containsKey("actionType")) {
            builder.and(q.actionType.containsIgnoreCase(searchParams.get("actionType")));
        }
        if (searchParams.containsKey("userAgent")) {
            builder.and(q.userAgent.containsIgnoreCase(searchParams.get("userAgent")));
        }
        if (searchParams.containsKey("ipAddress")) {
            builder.and(q.ipAddress.containsIgnoreCase(searchParams.get("ipAddress")));
        }
        if (searchParams.containsKey("user")) {
            builder.and(q.user.containsIgnoreCase(searchParams.get("user")));
        }
        if (searchParams.containsKey("login")) {
            builder.and(q.login.containsIgnoreCase(searchParams.get("login")));
        }
        if (searchParams.containsKey("method")) {
            builder.and(q.method.containsIgnoreCase(searchParams.get("method")));
        }
        // TODO : For some reason the block below causes the listing to return 0 elements.
//        if (searchParams.containsKey("page")) {
//            builder.and(q.page.containsIgnoreCase(searchParams.get("page")));
//        }
        if (searchParams.containsKey("refererPage")) {
            builder.and(q.refererPage.containsIgnoreCase(searchParams.get("refererPage")));
        }
        if (searchParams.containsKey("queryString")) {
            builder.and(q.queryString.containsIgnoreCase(searchParams.get("queryString")));
        }
        if (searchParams.containsKey("creationDate")) {
            builder.and(q.creationDate.before(LocalDateTime.parse(searchParams.get("creationDate"))));
        }
        if (searchParams.containsKey("data")) {
            builder.and(q.data.containsIgnoreCase(searchParams.get("data")));
        }
        if (searchParams.containsKey("path")) {
            builder.and(q.path.containsIgnoreCase(searchParams.get("path")));
        }
        return findAll(builder, pageable);
    }
}
