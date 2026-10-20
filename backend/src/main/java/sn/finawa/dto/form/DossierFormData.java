package sn.finawa.dto.form;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DossierFormData implements Serializable {

    @Builder.Default
    private EnterpriseInfoDto enterprise = new EnterpriseInfoDto();

    @Builder.Default
    private FinancingRequestDto financing = new FinancingRequestDto();

    @Builder.Default
    private FinancialInfoDto financial = new FinancialInfoDto();

    @Builder.Default
    private List<ShareholderDto> shareholders = new ArrayList<>();

    @Builder.Default
    private List<ManagerDto> managers = new ArrayList<>();

    private String history;
    private String milestones;
    private String generalObservations;
    private String managementObservations;
    private String bankingObservations;
    private String clientsObservations;
    private String suppliersObservations;

    @Builder.Default
    private List<BankRelationItemDto> bankRelations = new ArrayList<>();

    @Builder.Default
    private List<ProductActivityItemDto> products = new ArrayList<>();

    @Builder.Default
    private List<AssetItemDto> assets = new ArrayList<>();

    @Builder.Default
    private List<ClientItemDto> clients = new ArrayList<>();

    @Builder.Default
    private List<SupplierItemDto> suppliers = new ArrayList<>();

    @Builder.Default
    private ConsentDto consent = new ConsentDto();

    private Integer completenessPercentage;
    private List<String> missingRequiredFields;
}
