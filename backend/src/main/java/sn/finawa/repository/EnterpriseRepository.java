package sn.finawa.repository;

import com.querydsl.core.BooleanBuilder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.querydsl.QuerydslPredicateExecutor;
import sn.finawa.entity.EnterpriseEntity;
import sn.finawa.entity.QEnterpriseEntity;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

public interface EnterpriseRepository  extends JpaRepository<EnterpriseEntity, Long>, QuerydslPredicateExecutor<EnterpriseEntity> {

    Optional<EnterpriseEntity> findByUserLogin(String login);

    Optional<EnterpriseEntity> findByUserId(Long userId);

    default Page<EnterpriseEntity> readAll(Map<String, String> searchParams, Pageable pageable) {
        var builder = new BooleanBuilder();
        var q = QEnterpriseEntity.enterpriseEntity;
        if (searchParams.containsKey("id")) {
            builder.and(q.id.eq(Long.valueOf(searchParams.get("id"))));
        }
        if (searchParams.containsKey("name")) {
            builder.and(q.name.containsIgnoreCase(searchParams.get("name")));
        }
        if (searchParams.containsKey("summary")) {
            builder.and(q.summary.containsIgnoreCase(searchParams.get("summary")));
        }
        if (searchParams.containsKey("region")) {
            builder.and(q.region.containsIgnoreCase(searchParams.get("region")));
        }
        if (searchParams.containsKey("turnoverInf")) {
            builder.and(q.annualTurnover.loe(Long.valueOf(searchParams.get("turnoverInf"))));
        }
        if (searchParams.containsKey("turnoverSup")) {
            builder.and(q.annualTurnover.goe(Long.valueOf(searchParams.get("turnoverSup"))));
        }
        if (searchParams.containsKey("employeeInf")) {
            builder.and(q.employeeCount.loe(Long.valueOf(searchParams.get("employeeInf"))));
        }
        if (searchParams.containsKey("employeeSup")) {
            builder.and(q.employeeCount.goe(Long.valueOf(searchParams.get("employeeSup"))));
        }
        if (searchParams.containsKey("typeId")) {
            builder.and(q.type.id.eq(Long.valueOf(searchParams.get("typeId"))));
        }
        if (searchParams.containsKey("sectorId")) {
            builder.and(q.sector.id.eq(Long.valueOf(searchParams.get("sectorId"))));
        }
        if (searchParams.containsKey("user")) {
            builder.and(q.user.login.containsIgnoreCase(searchParams.get("user")));
        }
        if (searchParams.containsKey("creationDate")) {
            builder.and(q.createdDate.before(LocalDateTime.parse(searchParams.get("creationDate"))));
        }
        return findAll(builder, pageable);
    }
}
