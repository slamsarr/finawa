package sn.finawa.annotation;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Retention(RetentionPolicy.RUNTIME) // disponible partout
@Target(ElementType.METHOD) // elle est appliquée sur les méthodes
public @interface Journal {
    String actionType();
}
