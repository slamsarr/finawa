package sn.finawa.dto.helper;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.Accessors;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;


@Getter
@Setter
@Accessors(chain = true)
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
@AllArgsConstructor
@Builder
public class Response<T> {

    private T payload;
    private PageMetadata metadata;
    private String message;

    public static <T> ResponseEntity<Response<T>> ok(T element) {
        Response<T> response = new Response<>();
        response.payload = element;
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    public static <T> ResponseEntity<Response<List<T>>> ok(List<T> list) {
        Response<List<T>> response = new Response<>();
        response.payload = list;
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    public static <T> ResponseEntity<Response<List<T>>> ok(Page<T> page) {
        Response<List<T>> response = new Response<>();
        response.payload = page.getContent();
        response.metadata = new PageMetadata(page);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    public static ResponseEntity<Response<Void>> ok(String message) {
        return genericResponse(message, HttpStatus.OK);
    }

    public static <T> ResponseEntity<Response<T>> created(T element) {
        Response<T> response = new Response<>();
        response.payload = element;
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    public static ResponseEntity<Response<Void>> noContent() {
        return genericResponse(null, HttpStatus.NO_CONTENT);
    }

    public static ResponseEntity<Response<Void>> internalError(String message) {
        return genericResponse(message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    public static ResponseEntity<Response<Void>> badRequest(String message) {
        return genericResponse(message, HttpStatus.BAD_REQUEST);
    }

    public static ResponseEntity<Response<Void>> badGateway(String message) {
        return genericResponse(message, HttpStatus.BAD_GATEWAY);
    }

    public static ResponseEntity<Response<Void>> unauthorized(String message) {
        return genericResponse(message, HttpStatus.UNAUTHORIZED);
    }

    public static ResponseEntity<Response<Void>> locked(String message) {
        return genericResponse(message, HttpStatus.LOCKED);
    }

    public static ResponseEntity<Response<Void>> forbidden(String message) {
        return genericResponse(message, HttpStatus.FORBIDDEN);
    }

    public static ResponseEntity<Response<Void>> methodNotAllowed(String message) {
        return genericResponse(message, HttpStatus.METHOD_NOT_ALLOWED);
    }

    public static ResponseEntity<Response<Void>> notFound(String message) {
        return genericResponse(message, HttpStatus.NOT_FOUND);
    }

    public static ResponseEntity<Response<Void>> notAcceptable(String message) {
        return genericResponse(message, HttpStatus.NOT_ACCEPTABLE);
    }

    public static ResponseEntity<Response<Void>> requestTimeout(String message) {
        return genericResponse(message, HttpStatus.REQUEST_TIMEOUT);
    }

    public static ResponseEntity<Response<Void>> conflict(String message) {
        return genericResponse(message, HttpStatus.CONFLICT);
    }

    public static ResponseEntity<Response<Void>> payloadTooLarge(String message) {
        return genericResponse(message, HttpStatus.PAYLOAD_TOO_LARGE);
    }

    public static ResponseEntity<Response<Void>> unprocessableEntity(String message) {
        return genericResponse(message, HttpStatus.UNPROCESSABLE_ENTITY);
    }

    public static ResponseEntity<Response<Void>> unsupportedMediaType(String message) {
        return genericResponse(message, HttpStatus.UNSUPPORTED_MEDIA_TYPE);
    }

    private static ResponseEntity<Response<Void>> genericResponse(String message, HttpStatus status) {
        Response<Void> response = new Response<>();
        response.setMessage(message);
        return new ResponseEntity<>(response, status);
    }

    @Getter
    @Accessors(chain = true)
    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonIgnoreProperties(ignoreUnknown = true)
    @Builder
    public static class PageMetadata {
        private final int size;
        private final long totalElements;
        private final int totalPages;
        private final int number;

        public PageMetadata(int size, long totalElements, int totalPages, int number) {
            this.size = size;
            this.totalElements = totalElements;
            this.totalPages = totalPages;
            this.number = number;
        }

        public PageMetadata(Page<?> page) {
            this.size = page.getSize();
            this.totalElements = page.getTotalElements();
            this.totalPages = page.getTotalPages();
            this.number = page.getNumber();
        }
    }
}
