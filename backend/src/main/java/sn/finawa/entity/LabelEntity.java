package sn.finawa.entity;

import lombok.*;
import sn.finawa.entity.audit.Auditable;
import sn.finawa.entity.enums.ReferentialType;

import jakarta.persistence.*;
import java.io.Serializable;

@Table(name = "finawa_label")
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LabelEntity extends Auditable<String> implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "lbl_id")
    private Long id;

    @Column(name = "lbl_type")
    @Enumerated(EnumType.STRING)
    private ReferentialType referentialType;

    @Column(name = "lbl_name")
    private String name;

    @Column(name = "lbl_description")
    private String description;

}
