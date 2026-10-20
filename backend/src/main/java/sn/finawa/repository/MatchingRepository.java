package sn.finawa.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import sn.finawa.entity.MatchingEntity;

import java.util.List;
import java.util.Optional;

@Repository
public interface MatchingRepository extends JpaRepository<MatchingEntity, Long> {

    List<MatchingEntity> findByDossierId(Long dossierId);

    List<MatchingEntity> findByPartnerId(Long partnerId);

    Optional<MatchingEntity> findByDossierIdAndPartnerId(Long dossierId, Long partnerId);

    @Query("SELECT m FROM MatchingEntity m WHERE m.dossier.id = :dossierId ORDER BY m.score DESC")
    List<MatchingEntity> findByDossierIdOrderByScoreDesc(@Param("dossierId") Long dossierId);

    @Query("SELECT m FROM MatchingEntity m WHERE m.dossier.id = :dossierId AND m.status = :status")
    List<MatchingEntity> findByDossierIdAndStatus(@Param("dossierId") Long dossierId, @Param("status") String status);

    void deleteByDossierId(Long dossierId);
}
