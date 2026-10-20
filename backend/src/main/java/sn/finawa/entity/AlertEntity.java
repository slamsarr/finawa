package sn.finawa.entity;

import lombok.*;
import sn.finawa.entity.audit.Auditable;

import jakarta.persistence.*;
import java.io.Serializable;
import java.time.LocalDateTime;

@Table(name = "finawa_alert")
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AlertEntity extends Auditable<String> implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ale_id")
    private Long id;

    @Column(name = "ale_message", columnDefinition = "TEXT")
    private String message;

    @Column(name = "ale_date")
    @Temporal(TemporalType.TIMESTAMP)
    private LocalDateTime date;

    @Column(name = "ale_read")
    private boolean read;

    @ManyToOne
    @JoinColumn(name = "ale_linked_priority")
    private LabelEntity priority;

    @ManyToOne
    @JoinColumn(name = "ale_linked_user")
    private UserEntity user;

}
