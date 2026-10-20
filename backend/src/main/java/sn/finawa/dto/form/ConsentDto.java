package sn.finawa.dto.form;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConsentDto implements Serializable {
    private Boolean certifiedExact;
    private LocalDateTime consentDate;
    private String submittedBy;
    private String notes;
}
