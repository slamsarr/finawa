package sn.finawa.entity;

import lombok.*;
import sn.finawa.entity.audit.Auditable;

import jakarta.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

@Table(name = "finawa_partner")
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PartnerEntity extends Auditable<String> implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "prt_id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "prt_user_id")
    private UserEntity user;

    @Column(name = "prt_name")
    private String name;

    @Column(name = "prt_type")
    private String type;

    @Column(name = "prt_description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "prt_conditions", columnDefinition = "TEXT")
    private String conditions;

    @Column(name = "prt_pricing")
    private String pricing;

    @Column(name = "prt_min_amount")
    private BigDecimal minAmount;

    @Column(name = "prt_max_amount")
    private BigDecimal maxAmount;

    @Column(name = "prt_min_duration_months")
    private Integer minDurationMonths;

    @Column(name = "prt_max_duration_months")
    private Integer maxDurationMonths;

    @Column(name = "prt_interest_rate")
    private BigDecimal interestRate;

    @Column(name = "prt_score")
    private Integer score;

    @Column(name = "prt_active")
    private Boolean active;

    @ManyToOne
    @JoinColumn(name = "prt_linked_partner_type")
    private LabelEntity partnerType;

    @ManyToMany
    @JoinTable(
        name = "partner_zone",
        joinColumns = @JoinColumn(name = "prt_id"),
        inverseJoinColumns = @JoinColumn(name = "lbl_id")
    )
    private Set<LabelEntity> zones = new HashSet<>();

    @ManyToMany
    @JoinTable(
        name = "partner_sector",
        joinColumns = @JoinColumn(name = "prt_id"),
        inverseJoinColumns = @JoinColumn(name = "lbl_id")
    )
    private Set<LabelEntity> sectors = new HashSet<>();

}
