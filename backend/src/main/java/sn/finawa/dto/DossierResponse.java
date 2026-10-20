package sn.finawa.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DossierResponse {

    private Long id;
    private String reference;
    private Long enterpriseId;
    private String enterpriseName;
    private Long needTypeId;
    private String needTypeName;
    private BigDecimal amount;
    private Integer durationMonths;
    private String purpose;
    private String status;
    private Integer score;
    private LocalDateTime submissionDate;
    private String nextAction;
    private String description;
    private Boolean caValid;
    private Boolean nineaProvided;
    private Boolean guaranteeComplete;
    private sn.finawa.dto.form.DossierFormData formData;
    private Boolean isDraft;
    private LocalDateTime lastExportedAt;
    private String expertNotes;
    private Integer version;
    private LocalDateTime createdDate;
    private LocalDateTime modifiedDate;
}
