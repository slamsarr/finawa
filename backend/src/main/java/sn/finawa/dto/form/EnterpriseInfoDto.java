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
public class EnterpriseInfoDto implements Serializable {
    private String legalName;
    private String commercialName;
    private String creationYear;
    private String legalForm;
    private String sector;
    private String mainActivity;
    private String description;
    private String address;
    private String city;
    private String cityZone;
    private String rccm;
    private String ninea;
    private Long employees;
    private String seniority;
    private String managerName;
    private String managerRole;
    private String focalPointName;
    private String focalPointRole;
    private String phone;
    private String email;
}
