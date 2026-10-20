package sn.finawa.aspect;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.ClassUtils;
import org.apache.commons.lang3.reflect.FieldUtils;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;
import sn.finawa.annotation.Journal;
import sn.finawa.annotation.JournalAttribute;
import sn.finawa.dto.UserResponse;
import sn.finawa.entity.JournalEntity;
import sn.finawa.exception.UnhandledTraceableFieldException;
import sn.finawa.repository.JournalRepository;
import sn.finawa.repository.UserRepository;
import sn.finawa.security.SecurityUtils;
import sn.finawa.utility.HttpRequestResponseUtils;

import java.lang.reflect.Field;
import java.text.DateFormat;
import java.text.MessageFormat;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Aspect
@Component
@FieldDefaults(level = AccessLevel.PRIVATE)
@RequiredArgsConstructor
@Slf4j
public class JournalAspect {
    final JournalRepository journalRepository;
    final UserRepository userRepository;
    final ObjectMapper objectMapper;

    @Around("@annotation(journal)")
    public Object traceJournal(ProceedingJoinPoint p, Journal journal) throws Throwable {
        Object object = p.proceed();
        if (Objects.isNull(object) || (object instanceof Optional && ((Optional<?>) object).isEmpty())) {
            saveJournal(journal.actionType(), "{}", null);
            log.info("traceJournal null or optional empty - actionType: {}", journal.actionType());
        } else {
            final List<Object> objects;
            if (object instanceof ArrayList) {
                objects = (List<Object>) object;
            } else if (object instanceof Optional && ((Optional<?>) object).isPresent()) {
                objects = Collections.singletonList(((Optional<?>) object).get());
            } else {
                objects = Collections.singletonList(object);
            }
            for (Object o : objects) {
                traceJournalForObject(journal.actionType(), o, false);
            }
        }
        return object;
    }

    private String asString(Object object) {
        if (Objects.isNull(object)) {
            return null;
        }
        if (object.getClass().equals(String.class) || ClassUtils.isPrimitiveOrWrapper(object.getClass())
                || object.getClass().isEnum()) {
            return object.toString();
        }
        if (object.getClass().equals(Date.class)) {
            DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss");
            return dateFormat.format(object);
        }
        if (object.getClass().equals(LocalDate.class)) {
            return ((LocalDate) object).format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
        }
        if (object.getClass().equals(LocalDateTime.class)) {
            return ((LocalDateTime) object).format(DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss"));
        }
        throw new UnhandledTraceableFieldException(
                MessageFormat.format("The type {0} is not handled !", object.getClass().getName()));
    }

    private void saveJournal(String actionType, String data, UserResponse user) {
        var journal = JournalEntity.builder()
                .ipAddress(HttpRequestResponseUtils.getClientIpAddress())
                .actionType(actionType.contains(":") ? actionType.split(":")[0] : actionType)
                .path(actionType.contains(":") && actionType.split(":").length > 1 ? actionType.split(":")[1] : "")
                .queryString(HttpRequestResponseUtils.getPageQueryString())
                .page(HttpRequestResponseUtils.getRequestUri())
                .url(HttpRequestResponseUtils.getRequestUrl())
                .userAgent(HttpRequestResponseUtils.getUserAgent())
                .method(HttpRequestResponseUtils.getRequestMethod())
                .refererPage(HttpRequestResponseUtils.getRefererPage())
                .data(data)
                .user(SecurityUtils.getCurrentUserLogin().orElse("anonymous"))
                .build();
        if (Objects.isNull(user)) {
            SecurityUtils.getCurrentUserLogin()
                    .flatMap(userRepository::findByLogin)
                    .ifPresent(userEntity -> journal.setLogin(userEntity.getLogin()));
        } else {
            journal.setUser(user.getLogin());
        }
        journalRepository.save(journal);
    }

    private void traceJournalForObject(String actionType, Object object, boolean isLogout)
            throws IllegalAccessException, JsonProcessingException {
        TreeMap<String, String> data = new TreeMap<>();
        for (Field field : FieldUtils.getFieldsListWithAnnotation(object.getClass(), JournalAttribute.class)) {
            Object fieldObject = FieldUtils.readField(object, field.getName(), true);
            if (field.getType().equals(String.class) ||
                    ClassUtils.isPrimitiveOrWrapper(field.getType()) ||
                    field.getType().isEnum() ||
                    field.getType().equals(Date.class) ||
                    field.getType().equals(LocalDateTime.class) ||
                    field.getType().equals(LocalDate.class)) {
                data.put(field.getName(), asString(fieldObject));
            } else if (Objects.nonNull(fieldObject)) {
                for (Field subField : FieldUtils.getFieldsListWithAnnotation(field.getType(), JournalAttribute.class)) {
                    String subFieldName = field.getName() + "|" + subField.getName();
                    data.put(subFieldName, asString(FieldUtils.readField(fieldObject, subField.getName(), true)));
                }
            }
        }
        saveJournal(actionType, objectMapper.writeValueAsString(data), isLogout ? (UserResponse) object : null);
    }
}
