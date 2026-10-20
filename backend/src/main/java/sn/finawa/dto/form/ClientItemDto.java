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
public class ClientItemDto implements Serializable {
    private String clientName;
    private String turnoverN1;
    private String paymentTerms;
}
