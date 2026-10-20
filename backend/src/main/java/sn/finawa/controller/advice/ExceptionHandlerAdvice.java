package sn.finawa.controller.advice;

import io.jsonwebtoken.ExpiredJwtException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import sn.finawa.exception.*;
import sn.finawa.exception.InternalError;
import sn.finawa.dto.helper.Response;

// TODO : Error's sometimes return sql que
@Slf4j
@RestControllerAdvice
public class ExceptionHandlerAdvice {

    @Value("${spring.servlet.multipart.max-file-size}")
    private String maxFileSize;

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Response<Void>> handleInvalidArguments(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(err -> err.getField() + ": " + err.getDefaultMessage())
                .collect(java.util.stream.Collectors.joining("; "));
        log.error(message);
        return Response.unprocessableEntity(message);
    }

    @ExceptionHandler(InvalidArgumentType.class)
    public ResponseEntity<Response<Void>> handleInvalidArgumentTypeException(InvalidArgumentType ex) {
        log.error(ex.getMessage());
        return Response.unprocessableEntity(ex.getMessage());
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<Response<Void>> handleMaxSizeException(MaxUploadSizeExceededException ex) {
        log.error("File size limit exceeded: {}", ex.getMessage());
        return Response.payloadTooLarge("Le fichier est trop volumineux ! La taille maximale autorisée est de " + maxFileSize + ".");
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Response<Void>> notFound(ResourceNotFoundException ex) {
        log.error(ex.getMessage());
        return Response.notFound(ex.getMessage());
    }

    @ExceptionHandler(ResourceAlreadyExistException.class)
    public ResponseEntity<Response<Void>> conflict(ResourceAlreadyExistException ex) {
        log.error(ex.getMessage());
        return Response.conflict(ex.getMessage());
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Response<Void>> invalidInput(final HttpMessageNotReadableException e) {
        log.error("HttpMessageNotReadableException: {}", e.getMessage());

        Throwable rootCause = e;
        while (rootCause.getCause() != null) {
            rootCause = rootCause.getCause();
        }

        return Response.unprocessableEntity(rootCause.getMessage());
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Response<Void>> badCredentials(BadCredentialsException ex) {
        log.error("badCredentials: {}", ex.getMessage());
        return Response.notAcceptable(ex.getMessage());
    }

    @ExceptionHandler(ForbiddenException.class)
    public ResponseEntity<Response<Void>> forbiddenExceptionHander(ForbiddenException ex) {
        log.error("Forbidden: {}", ex.getMessage());
        return Response.forbidden(ex.getMessage());
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<Response<Void>> unauthorizedExceptionHandler(UnauthorizedException ex) {
        log.error("Unauthorized: {}", ex.getMessage());
        return Response.unauthorized(ex.getMessage());
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Response<Void>> handleDataIntegrity(
            DataIntegrityViolationException ex) {
        log.error("Database integrity violation", ex);
        return  Response.internalError("The operation could not be completed because the data is still referenced.");
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Response<Void>> handle(Exception ex) {
        log.error("Unexpected exception", ex);
        return Response.internalError("An unexpected error occurred.");
    }

    @ExceptionHandler(PasswordException.class)
    public ResponseEntity<Response<Void>> passwordExceptionHandler(PasswordException ex) {
        log.error(ex.getMessage());
        return Response.unauthorized(ex.getMessage());
    }

    @ExceptionHandler(UserDisabledException.class)
    public ResponseEntity<Response<Void>> userDisabledException(UserDisabledException ex) {
        log.error(ex.getMessage());
        return Response.unauthorized(ex.getMessage());
    }

    @ExceptionHandler(InternalError.class)
    public ResponseEntity<Response<Void>> internalErrorExceptionHandler(InternalError ex) {
        log.error(ex.getMessage());
        return Response.internalError(ex.getMessage());
    }

    @ExceptionHandler(ExpiredJwtException.class)
    public ResponseEntity<Response<Void>> expiredJwtException(ExpiredJwtException ex) {
        log.error(ex.getMessage());
        return Response.unauthorized(ex.getMessage());
    }
}
