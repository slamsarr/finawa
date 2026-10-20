package sn.finawa.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PartnerCreateRequest {

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotBlank(message = "Name is required")
    @Size(max = 255, message = "Name cannot exceed 255 characters")
    private String name;

    @NotBlank(message = "Type is required")
    @Size(max = 100, message = "Type cannot exceed 100 characters")
    private String type;

    @Size(max = 2000, message = "Description cannot exceed 2000 characters")
    private String description;

    @Size(max = 2000, message = "Conditions cannot exceed 2000 characters")
    private String conditions;

    @Size(max = 500, message = "Pricing cannot exceed 500 characters")
    private String pricing;

    @DecimalMin(value = "0.01", message = "Min amount must be greater than 0")
    private BigDecimal minAmount;

    @DecimalMin(value = "0.01", message = "Max amount must be greater than 0")
    private BigDecimal maxAmount;

    @Min(value = 1, message = "Min duration must be at least 1 month")
    private Integer minDurationMonths;

    @Min(value = 1, message = "Max duration must be at least 1 month")
    private Integer maxDurationMonths;

    @DecimalMin(value = "0", message = "Interest rate cannot be negative")
    private BigDecimal interestRate;

    private Long partnerTypeId;

    @NotEmpty(message = "At least one zone is required")
    private List<Long> zoneIds;

    @NotEmpty(message = "At least one sector is required")
    private List<Long> sectorIds;
}
