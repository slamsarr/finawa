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
public class ProductActivityItemDto implements Serializable {
    private String name;
    private String shareTurnoverN1;
    private String shareTurnoverN2;
}
