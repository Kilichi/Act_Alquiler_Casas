package alquiler.api.models;

import jakarta.persistence.*;
import lombok.Getter;

@Getter
@Entity
@Table(name = "viviendas") // Tabla correcta
public class ViviendaModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "direccion")
    private String direccion; // String para texto

    @Column(name = "precio")
    private double precio;

    @Column(name = "disponible")
    private boolean disponible;

    @Column(name = "numero_habitaciones")
    private int numeroHabitaciones;
}