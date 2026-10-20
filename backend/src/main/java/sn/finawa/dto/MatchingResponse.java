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
public class MatchingResponse {

    private Long id;
    private Long dossierId;
    private String dossierReference;
    private Long partnerId;
    private String partnerName;
    private BigDecimal score;
    private LocalDateTime matchDate;
    private String status;
    private Boolean amountSuitable;
    private Boolean durationSuitable;
    private Boolean sectorSuitable;
    private Boolean zoneSuitable;
    private String notes;
    private LocalDateTime createdDate;
}
