package sn.finawa.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import sn.finawa.entity.PartnerEntity;

import java.util.List;
import java.util.Optional;

@Repository
public interface PartnerRepository extends JpaRepository<PartnerEntity, Long> {

    Optional<PartnerEntity> findByUserId(Long userId);

    List<PartnerEntity> findByActiveTrue();

    List<PartnerEntity> findByType(String type);

    @Query("SELECT p FROM PartnerEntity p WHERE p.active = true AND p.type = :type")
    List<PartnerEntity> findActiveByType(@Param("type") String type);

    @Query("SELECT p FROM PartnerEntity p JOIN p.zones z WHERE z.id = :zoneId AND p.active = true")
    List<PartnerEntity> findByZoneId(@Param("zoneId") Long zoneId);

    @Query("SELECT p FROM PartnerEntity p JOIN p.sectors s WHERE s.id = :sectorId AND p.active = true")
    List<PartnerEntity> findBySectorId(@Param("sectorId") Long sectorId);
}
