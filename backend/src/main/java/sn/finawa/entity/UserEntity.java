package sn.finawa.entity;

import lombok.*;
import sn.finawa.entity.audit.Auditable;

import jakarta.persistence.*;
import java.io.Serializable;

@Table(name = "finawa_user")
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserEntity extends Auditable<String> implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "usr_id")
    private Long id;

    @Column(name = "usr_login", unique = true)
    private String login;

    @Column(name = "usr_password")
    private String password;

    @Column(name = "usr_first_attempt")
    private boolean firstAttempt;

    @Column(name = "usr_active")
    private Boolean active;

    @ManyToOne()
    @JoinColumn(name = "usr_linked_profile")
    private ProfileEntity profile;

}
