package sn.finawa.entity;

import lombok.*;
import sn.finawa.entity.audit.Auditable;

import jakarta.persistence.*;
import java.io.Serializable;
import java.time.LocalDateTime;

@Table(name = "finawa_document")
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class DocumentEntity extends Auditable<String> implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "doc_id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "owner_usr_id")
    private UserEntity owner;

    @Column(name = "doc_name", unique = true)
    private String name;

    @Column(name = "doc_stored_name")
    private String storedName;

    @Column(name = "doc_extension")
    private String extension;

    @Column(name = "doc_size")
    private Long size;

    @Column(name = "doc_description")
    private String description;

    @Column(name = "doc_date")
    @Temporal(TemporalType.TIMESTAMP)
    private LocalDateTime uploadDate;

    @ManyToOne
    @JoinColumn(name = "doc_linked_document_type")
    private LabelEntity documentType;

    // TODO : Implement the logic for this to work correctly
    // TODO : Admins should still be able to see files marked as deleted.
    // TODO : And restore them or completely delete them if needed
    @Column(name = "doc_mark_delete")
    private Boolean deleted;

}
