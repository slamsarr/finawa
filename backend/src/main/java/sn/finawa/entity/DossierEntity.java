package sn.finawa.entity;

import lombok.*;
import sn.finawa.entity.audit.Auditable;

import jakarta.persistence.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Table(name = "finawa_dossier")
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DossierEntity extends Auditable<String> implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "dos_id")
    private Long id;

    @Column(name = "dos_reference", unique = true)
    private String reference;

    @ManyToOne
    @JoinColumn(name = "dos_enterprise_id")
    private EnterpriseEntity enterprise;

    @ManyToOne
    @JoinColumn(name = "dos_linked_need_type")
    private LabelEntity needType;

    @Column(name = "dos_amount")
    private BigDecimal amount;

    @Column(name = "dos_duration_months")
    private Integer durationMonths;

    @Column(name = "dos_purpose")
    private String purpose;

    @Column(name = "dos_status")
    private String status;

    @Column(name = "dos_score")
    private Integer score;

    @Column(name = "dos_submission_date")
    private LocalDateTime submissionDate;

    @Column(name = "dos_next_action")
    private String nextAction;

    @Column(name = "dos_description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "dos_ca_valid")
    private Boolean caValid;

    @Column(name = "dos_ninea_provided")
    private Boolean nineaProvided;

    @Column(name = "dos_guarantee_complete")
    private Boolean guaranteeComplete;

    @Column(name = "dos_form_data", columnDefinition = "TEXT")
    private String formData;

    @Column(name = "dos_is_draft")
    private Boolean isDraft;

    @Column(name = "dos_last_exported_at")
    private LocalDateTime lastExportedAt;

    @Column(name = "dos_expert_notes", columnDefinition = "TEXT")
    private String expertNotes;

    @Column(name = "dos_version")
    private Integer version;

}
