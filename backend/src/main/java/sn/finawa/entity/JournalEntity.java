package sn.finawa.entity;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Table(name = "finawa_journal")
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EntityListeners(AuditingEntityListener.class)
public class JournalEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "jnl_id")
    private Long id;

    @Column(name = "jnl_typeAction")
    private String actionType;

    @Column(name = "jnle_adresse_ip")
    private String ipAddress;

    @Column(name = "jnle_user_agent")
    private String userAgent;

    @Column(name = "jnle_user")
    private String user;

    @Column(name = "jnle_lgin")
    private String login;

    @Column(name = "method_http")
    private String method;

    @Column(name = "url")
    private String url;

    @Column(name = "page")
    private String page;

    @Column(name = "query_string", columnDefinition = "TEXT")
    private String queryString;

    @Column(name = "referer_page")
    private String refererPage;

    @CreatedDate
    @Column(name = "created_date")
    private LocalDateTime creationDate;

    @Column(name = "data", columnDefinition = "TEXT")
    private String data;

    @Column(name = "path")
    private String path;

}
