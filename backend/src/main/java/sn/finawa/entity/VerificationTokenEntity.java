package sn.finawa.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import sn.finawa.entity.audit.Auditable;

import java.io.Serializable;
import java.time.LocalDateTime;

@Table(name = "finawa_verification_token")
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VerificationTokenEntity extends Auditable<String> implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "tok_id")
    private Long id;

    @Column(name = "tok_token", unique = true, nullable = false)
    private String token;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "tok_user_id", nullable = false)
    private UserEntity user;

    @Column(name = "tok_expiry_date", nullable = false)
    private LocalDateTime expiryDate;

    @Column(name = "tok_confirmed_date")
    private LocalDateTime confirmedDate;

    public boolean isExpired() {
        return LocalDateTime.now().isAfter(this.expiryDate);
    }

    public boolean isConfirmed() {
        return this.confirmedDate != null;
    }
}
