package sn.finawa.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sn.finawa.entity.UserEntity;
import sn.finawa.entity.VerificationTokenEntity;

import java.util.List;
import java.util.Optional;

@Repository
public interface VerificationTokenRepository extends JpaRepository<VerificationTokenEntity, Long> {

    Optional<VerificationTokenEntity> findByToken(String token);

    List<VerificationTokenEntity> findAllByUser(UserEntity user);

    void deleteAllByUser(UserEntity user);
}
