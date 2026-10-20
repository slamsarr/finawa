package sn.finawa.entity.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;


@Getter
@AllArgsConstructor
public enum SecurityPermissions {
    // TODO : This needs some reevaluation or make it more granular because
    //  If a simple user has a "READ_ALERT" permission, then he can read every single alert,
    //  including the ones that aren't his.
    //  Separate between admin permissions and user permissions. Admin should be able to "Read_ALL" and
    //  users should only be able to read their personal infos.
    //  Maybe make permissions extremely granular pretty much one or more permissions for every single action
    //  e.g "Read_User", "Read_All_Users", "Read_Me" (for the currently logged in user)

    ALL_ACCESS("Permit All", Feature.SUPER_ADMIN),

    READ_LOG("Read Logs", Feature.SYSTEM_ADMINISTRATION),

    READ_REFERENTIAL("Read ReferentialTypes", Feature.SYSTEM_ADMINISTRATION),
    ADD_LABEL("Add Label", Feature.SYSTEM_ADMINISTRATION),
    EDIT_LABEL("Edit Label", Feature.SYSTEM_ADMINISTRATION),
    DELETE_LABEL("Delete Label", Feature.SYSTEM_ADMINISTRATION),

    READ_ALERT("Read Alert", Feature.NOTIFICATION_MANAGEMENT),
    ADD_ALERT("Add Alert", Feature.NOTIFICATION_MANAGEMENT),
    EDIT_ALERT("Edit Alert", Feature.NOTIFICATION_MANAGEMENT),
    DELETE_ALERT("Delete Alert", Feature.NOTIFICATION_MANAGEMENT),

    READ_PERMISSIONS("Read Permissions", Feature.IDENTITY_ACCESS_MANAGEMENT),
    READ_PROFILE("Read Profile", Feature.IDENTITY_ACCESS_MANAGEMENT),
    ADD_PROFILE("Add Profile", Feature.IDENTITY_ACCESS_MANAGEMENT),
    EDIT_PROFILE("Edit Profile", Feature.IDENTITY_ACCESS_MANAGEMENT),
    DELETE_PROFILE("Delete Profile", Feature.IDENTITY_ACCESS_MANAGEMENT),

    READ_USER("Read User", Feature.IDENTITY_ACCESS_MANAGEMENT),
    ADD_USER("Add User", Feature.IDENTITY_ACCESS_MANAGEMENT),
    EDIT_USER("Edit User", Feature.IDENTITY_ACCESS_MANAGEMENT),
    DELETE_USER("Delete User", Feature.IDENTITY_ACCESS_MANAGEMENT),
    EDIT_STATUS_USER("Activate or Deactivate User", Feature.IDENTITY_ACCESS_MANAGEMENT),

    READ_DOCUMENT("Read Document", Feature.RESOURCE_MANAGEMENT),
    ADD_DOCUMENT("Add Document", Feature.RESOURCE_MANAGEMENT),
    EDIT_DOCUMENT("Edit Document", Feature.RESOURCE_MANAGEMENT),
    DELETE_DOCUMENT("Delete Document", Feature.RESOURCE_MANAGEMENT),
    READ_FILE_DOCUMENT("Read Document File", Feature.RESOURCE_MANAGEMENT),

    READ_DOSSIER("Read Dossier", Feature.RESOURCE_MANAGEMENT),
    ADD_DOSSIER("Add Dossier", Feature.RESOURCE_MANAGEMENT),
    EDIT_DOSSIER("Edit Dossier", Feature.RESOURCE_MANAGEMENT),
    DELETE_DOSSIER("Delete Dossier", Feature.RESOURCE_MANAGEMENT),
    EDIT_STATUS_DOSSIER("Edit Dossier Status", Feature.RESOURCE_MANAGEMENT),
    SUBMIT_DOSSIER("Submit Dossier", Feature.RESOURCE_MANAGEMENT),
    DOWNLOAD_CEP("Download CEP Model", Feature.RESOURCE_MANAGEMENT),

    READ_PARTNER("Read Partner", Feature.RESOURCE_MANAGEMENT),
    ADD_PARTNER("Add Partner", Feature.RESOURCE_MANAGEMENT),
    EDIT_PARTNER("Edit Partner", Feature.RESOURCE_MANAGEMENT),
    DELETE_PARTNER("Delete Partner", Feature.RESOURCE_MANAGEMENT),
    EDIT_STATUS_PARTNER("Edit Partner Status", Feature.RESOURCE_MANAGEMENT),

    READ_MATCHING("Read Matching", Feature.RESOURCE_MANAGEMENT),
    RUN_MATCHING("Run Matching", Feature.RESOURCE_MANAGEMENT),
    EDIT_MATCHING("Edit Matching", Feature.RESOURCE_MANAGEMENT),
    DELETE_MATCHING("Delete Matching", Feature.RESOURCE_MANAGEMENT),
    ;

    private final String description;
    private final Feature feature;
}
