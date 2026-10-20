package sn.finawa.repository;

import com.querydsl.core.BooleanBuilder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.stereotype.Repository;
import sn.finawa.entity.AlertEntity;
import sn.finawa.entity.QAlertEntity;

import java.time.LocalDateTime;
import java.util.Map;


@Repository
public interface AlerteRepository extends JpaRepository<AlertEntity, Long>, QuerydslPredicateExecutor<AlertEntity> {
    default Page<AlertEntity> readAll(Map<String, String> searchParams, Pageable pageable) {
        var builder = new BooleanBuilder();
        var q = QAlertEntity.alertEntity;
        if (searchParams.containsKey("id")) {
            builder.and(q.id.eq(Long.valueOf(searchParams.get("id"))));
        }
        if (searchParams.containsKey("message")) {
            builder.and(q.message.containsIgnoreCase(searchParams.get("message")));
        }
        if (searchParams.containsKey("date")) {
            builder.and(q.date.before(LocalDateTime.parse(searchParams.get("date"))));
        }
        if (searchParams.containsKey("read")) {
            builder.and(q.read.eq(Boolean.valueOf(searchParams.get("read"))));
        }
        if (searchParams.containsKey("priorityId")) {
            builder.and(q.priority.id.eq(Long.valueOf(searchParams.get("priorityId"))));
        }
        if (searchParams.containsKey("userId")) {
            builder.and(q.user.id.eq(Long.valueOf(searchParams.get("userId"))));
        }
        return findAll(builder, pageable);
    }
}
