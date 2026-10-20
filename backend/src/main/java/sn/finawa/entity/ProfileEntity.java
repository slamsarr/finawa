package sn.finawa.entity;

import lombok.*;
import sn.finawa.entity.audit.Auditable;

import jakarta.persistence.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;


@Table(name = "finawa_profile")
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class ProfileEntity extends Auditable<String> implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "prf_id")
    private Long id;

    @Column(name = "prf_name", unique = true)
    private String name;

    @Column(name = "prf_description")
    private String description;

    @ElementCollection(fetch = FetchType.EAGER)
    @JoinTable(name = "profile_permission", joinColumns = @JoinColumn(name = "prf_id"))
    @Column(name = "permission", nullable = false)
    private Set<String> permissions = new HashSet<>();

}
