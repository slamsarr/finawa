package sn.finawa.dto.form;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FinancingRequestDto implements Serializable {
    private BigDecimal desiredAmount;
    private BigDecimal exactAmount;
    private String currency;
    private String needType;
    private String detailedNeed;
    private String purpose;
    private String urgency;
    private String fundDeadline;
    private Integer durationMonths;
    private String contactPreference;
    private String source;
}
