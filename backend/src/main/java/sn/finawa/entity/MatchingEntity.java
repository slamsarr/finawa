package sn.finawa.entity;

import lombok.*;
import sn.finawa.entity.audit.Auditable;

import jakarta.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Table(name = "finawa_matching")
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MatchingEntity extends Auditable<String> implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "mch_id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "mch_dossier_id")
    private DossierEntity dossier;

    @ManyToOne
    @JoinColumn(name = "mch_partner_id")
    private PartnerEntity partner;

    @Column(name = "mch_score")
    private BigDecimal score;

    @Column(name = "mch_match_date")
    private LocalDateTime matchDate;

    @Column(name = "mch_status")
    private String status;

    @Column(name = "mch_amount_suitable")
    private Boolean amountSuitable;

    @Column(name = "mch_duration_suitable")
    private Boolean durationSuitable;

    @Column(name = "mch_sector_suitable")
    private Boolean sectorSuitable;

    @Column(name = "mch_zone_suitable")
    private Boolean zoneSuitable;

    @Column(name = "mch_notes", columnDefinition = "TEXT")
    private String notes;

}
