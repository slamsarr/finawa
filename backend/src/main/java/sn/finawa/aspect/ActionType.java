package sn.finawa.aspect;

import lombok.AccessLevel;
import lombok.experimental.FieldDefaults;

@FieldDefaults(level = AccessLevel.PRIVATE)
public class ActionType {

    public static final String SIGN_IN = "Logged in";
    public static final String PASSWORD_UPDATE = "Updated password";

    public static final String ADD_DOCUMENT = "Added documents";
    public static final String UPDATE_DOCUMENT = "Updated documents";
    public static final String DELETE_DOCUMENT = "Deleted documents";
    public static final String DELETE_FILE_ATTEMPT = "Attempted file deletion";

    public static final String ADD_PROFILE = "Added profile";
    public static final String UPDATE_PROFILE = "Updated profile";
    public static final String DELETE_PROFILE = "Deleted profile";

    public static final String READ_USER = "Read user";
    public static final String ADD_USER = "Added user";
    public static final String UPDATE_USER = "Updated user";
    public static final String DELETE_USER = "Deleted user";
    public static final String ACTIVATE_USER = "Activated user";
    public static final String DEACTIVATE_USER = "Deactivated user";

    public static final String ADD_LABEL = "Added label";
    public static final String UPDATE_LABEL = "Updated label";
    public static final String DELETE_LABEL = "Deleted label";

    public static final String READ_ALERT = "Read alert";
    public static final String ADD_ALERT = "Added alert";
    public static final String UPDATE_ALERT = "Updated alert";
    public static final String DELETE_ALERT = "Deleted alert";

    public static final String READ_LOG = "Read logs";
}
