package sn.finawa.repository;

import com.querydsl.core.BooleanBuilder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import org.springframework.stereotype.Repository;
import sn.finawa.entity.LabelEntity;
import sn.finawa.entity.QLabelEntity;
import sn.finawa.entity.enums.ReferentialType;

import java.util.*;

@Repository
public interface LabelRepository extends JpaRepository<LabelEntity, Long>, QuerydslPredicateExecutor<LabelEntity> {
    List<LabelEntity> findByReferentialType(ReferentialType referentialType);

    default Page<LabelEntity> readAll(Map<String, String> searchParams, Pageable pageable) {
        var builder = new BooleanBuilder();
        var q = QLabelEntity.labelEntity;
        if (searchParams.containsKey("id")) {
            builder.and(q.id.eq(Long.valueOf(searchParams.get("id"))));
        }
        if (searchParams.containsKey("referentialType")) {
            builder.and(q.referentialType.eq(ReferentialType.valueOf(searchParams.get("referentialType"))));
        }
        if (searchParams.containsKey("name")) {
            builder.and(q.name.containsIgnoreCase(searchParams.get("name")));
        }
        if (searchParams.containsKey("description")) {
            builder.and(q.description.containsIgnoreCase(searchParams.get("description")));
        }
        return findAll(builder, pageable);
    }
}
