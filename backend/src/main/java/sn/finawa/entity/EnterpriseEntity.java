package sn.finawa.entity;

import jakarta.persistence.*;
import lombok.*;
import sn.finawa.entity.audit.Auditable;

import java.io.Serializable;
import java.time.LocalDateTime;

@Table(name = "finawa_enterprise")
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EnterpriseEntity extends Auditable<String> implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ent_id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "ent_user_id")
    private UserEntity user;

    @Column(name = "ent_name")
    private String name;

    @Column(name = "ent_summary")
    private String summary;

    @Column(name = "ent_region")
    private String region;

    @Column(name = "ent_turnover")
    private Long annualTurnover;

    @Column(name = "ent_employees")
    private Long employeeCount;

    @Column(name = "ent_date")
    @Temporal(TemporalType.TIMESTAMP)
    private LocalDateTime creationDate;

    @ManyToOne
    @JoinColumn(name = "ent_linked_enterprise_type")
    private LabelEntity type;

    @ManyToOne
    @JoinColumn(name = "ent_linked_sector_type")
    private LabelEntity sector;

}
