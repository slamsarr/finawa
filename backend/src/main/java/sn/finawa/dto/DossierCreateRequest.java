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
public class DossierCreateRequest {

    private Long enterpriseId;

    private Long needTypeId;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
    private BigDecimal amount;

    @NotNull(message = "Duration is required")
    @Min(value = 1, message = "Duration must be at least 1 month")
    @Max(value = 360, message = "Duration cannot exceed 360 months")
    private Integer durationMonths;

    @NotBlank(message = "Purpose is required")
    @Size(max = 500, message = "Purpose cannot exceed 500 characters")
    private String purpose;

    @Size(max = 2000, message = "Description cannot exceed 2000 characters")
    private String description;

    private Boolean caValid;
    private Boolean nineaProvided;
    private Boolean guaranteeComplete;
    private sn.finawa.dto.form.DossierFormData formData;
    private Boolean isDraft;
}
