package sn.finawa.dto.form;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BankRelationItemDto implements Serializable {
    private String bankName;
    private String currentCommitment;
    private String accountNumber;
    private String agency;
    private String agencyPhone;
    private String agencyEmail;
    private String observations;
}
