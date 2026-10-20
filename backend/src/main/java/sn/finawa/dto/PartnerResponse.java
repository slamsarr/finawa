package sn.finawa.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PartnerResponse {

    private Long id;
    private Long userId;
    private String name;
    private String type;
    private String description;
    private String conditions;
    private String pricing;
    private BigDecimal minAmount;
    private BigDecimal maxAmount;
    private Integer minDurationMonths;
    private Integer maxDurationMonths;
    private BigDecimal interestRate;
    private Integer score;
    private Boolean active;
    private Long partnerTypeId;
    private String partnerTypeName;
    private List<String> zoneNames;
    private List<String> sectorNames;
    private LocalDateTime createdDate;
    private LocalDateTime modifiedDate;
}
