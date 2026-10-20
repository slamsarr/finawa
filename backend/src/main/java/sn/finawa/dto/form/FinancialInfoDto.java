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
public class FinancialInfoDto implements Serializable {
    private BigDecimal lastYearTurnover;
    private BigDecimal currentYearEstimatedTurnover;
    private BigDecimal netResult;
    private String lastClosedExercise;
    private String financialStatementsAvailable;
    private String certifiedStatements;
    private String accountingAssistanceFirm;
    private String statutoryAuditor;
    private String accountingSystemInfo;
    private String existingDebts;
    private String bankingRelationsSummary;
}
