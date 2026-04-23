package alquiler.api.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "viviendas") // Tabla correcta
public class ViviendaModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "direccion")
    private String direccion; // String para texto

    @Column(name = "precio")
    private Double precio;

    @Column(name = "disponible")
    private Boolean disponible;

    @Column(name = "numero_habitaciones")
    private Integer numeroHabitaciones;
}