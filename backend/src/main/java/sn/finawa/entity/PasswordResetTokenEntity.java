package sn.finawa.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import sn.finawa.entity.audit.Auditable;

import java.io.Serializable;
import java.time.LocalDateTime;

@Table(name = "finawa_password_reset_token")
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PasswordResetTokenEntity extends Auditable<String> implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "pwr_id")
    private Long id;

    @Column(name = "pwr_token", unique = true, nullable = false)
    private String token;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "pwr_user_id", nullable = false)
    private UserEntity user;

    @Column(name = "pwr_expiry_date", nullable = false)
    private LocalDateTime expiryDate;

    @Column(name = "pwr_used_date")
    private LocalDateTime usedDate;

    public boolean isExpired() {
        return LocalDateTime.now().isAfter(this.expiryDate);
    }

    public boolean isUsed() {
        return this.usedDate != null;
    }
}
