package sn.finawa.dto.administration;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;
import lombok.experimental.Accessors;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@Builder
@Accessors(chain = true)
@NoArgsConstructor
@AllArgsConstructor
@ToString
@JsonInclude(value = JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)
@Schema(name = "Journal")
public class AdminJournalResponse implements Serializable {
    private Long id;
    private String actionType;
    private String ipAddress;
    private String userAgent;
    private String user;
    private String login;
    private String method;
    private String url;
    private String page;
    private String queryString;
    private String refererPage;
    private LocalDateTime creationDate;
    private String data;
    private String path;
}
