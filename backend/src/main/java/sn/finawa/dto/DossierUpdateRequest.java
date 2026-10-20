package sn.finawa.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DossierUpdateRequest {

    private Long id;

    @NotNull(message = "Enterprise ID is required")
    private Long enterpriseId;

    private Long needTypeId;

    private BigDecimal amount;

    @Min(value = 1, message = "Duration must be at least 1 month")
    @Max(value = 360, message = "Duration cannot exceed 360 months")
    private Integer durationMonths;

    @Size(max = 500, message = "Purpose cannot exceed 500 characters")
    private String purpose;

    @Size(max = 2000, message = "Description cannot exceed 2000 characters")
    private String description;

    private String status;

    private Integer score;

    private String nextAction;

    private Boolean caValid;
    private Boolean nineaProvided;
    private Boolean guaranteeComplete;
    private sn.finawa.dto.form.DossierFormData formData;
    private Boolean isDraft;
    private String expertNotes;
}
