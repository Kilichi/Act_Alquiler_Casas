package alquiler.api.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Entity
@Table(name = "users")
public class UserModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nif", length = 9)
    private String nif;

    @Column(name = "username")
    private String username;

    @Column(name = "nombre")
    private String nombre;

    @Column(name = "apellidos")
    private String apellidos;

    @Column(name = "email")
    private String email;

    @Column(name = "password")
    private String password;

    @ManyToOne(optional = true) // Permite nulos
    @JoinColumn(name = "vivienda_id", nullable = true)
    private ViviendaModel vivienda;

    // Forma de hacer enum en jpa
    @Enumerated(EnumType.STRING)
    @Column(name = "profile", length = 20)
    private UserModelProfileNames profile;

}
