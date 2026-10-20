package sn.finawa.repository;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import sn.finawa.entity.TokenEntity;

import java.util.Optional;

@Repository
public interface TokenRepository extends JpaRepository<TokenEntity, Long> {

    Optional<TokenEntity> findByToken(String jwt);

    @Transactional
    @Modifying
    @Query("""
                UPDATE TokenEntity t
                SET t.revoked = true,
                    t.expired = true
                WHERE t.user.login = :login
                  AND (t.revoked = false OR t.expired = false)
            """)
    void revokeTokensByUsername(@Param("login") String login);
}
