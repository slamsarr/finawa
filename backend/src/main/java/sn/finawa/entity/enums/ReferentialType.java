package sn.finawa.entity.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;


@Getter
@AllArgsConstructor
public enum ReferentialType {
    DOCUMENT_TYPE("Document Type", "Contains different types of documents"),
    ALERT_PRIORITY("Alert Priority", "Contains different types of alert priorities"),
    ENTERPRISE_TYPE("Enterprise Type", "Contains different types of enterprises"),
    ENTERPRISE_SECTOR("Enterprise Sector", "Contains different types enterprise sectors"),
    NEED_TYPE("Need Type", "Contains different types of financing needs"),
    PARTNER_TYPE("Partner Type", "Contains different types of financial partners"),
    ZONE("Zone", "Contains geographical regions and zones"),
    ;

    private final String label;
    private final String description;
}
