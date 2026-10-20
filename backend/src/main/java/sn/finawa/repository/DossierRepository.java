package sn.finawa.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import sn.finawa.entity.DossierEntity;

import java.util.List;
import java.util.Optional;

@Repository
public interface DossierRepository extends JpaRepository<DossierEntity, Long> {

    Optional<DossierEntity> findByReference(String reference);

    List<DossierEntity> findByEnterpriseId(Long enterpriseId);

    @Query("SELECT d FROM DossierEntity d WHERE d.status = :status")
    List<DossierEntity> findByStatus(@Param("status") String status);

    @Query("SELECT d FROM DossierEntity d WHERE d.enterprise.id = :enterpriseId AND d.status = :status")
    List<DossierEntity> findByEnterpriseIdAndStatus(@Param("enterpriseId") Long enterpriseId, @Param("status") String status);

    boolean existsByReference(String reference);
}
