package sn.finawa.entity.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum Feature {

    SUPER_ADMIN("Super Admin"),
    SYSTEM_ADMINISTRATION("System Administration"),
    BUSINESS_ADMINISTRATION("Business Administration"),
    IDENTITY_ACCESS_MANAGEMENT("Identity and Access Management"),
    RESOURCE_MANAGEMENT("Resource Management"),
    NOTIFICATION_MANAGEMENT("Notification System"),
    ;

    private final String description;

}
