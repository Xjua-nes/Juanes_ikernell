// src/main/java/com/example/lab/Models/Etapa.java
package com.example.lab.Models;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "etapas")
public class Etapa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idEtapa;

    @ManyToOne
    @JoinColumn(name = "id_proyecto", nullable = false)
    private Proyecto proyecto;

    private String nombre;

    // ELIMINADA: private Integer orden;

    @Column(name = "fecha_inicio_estimada")
    private LocalDate fechaInicioEstimada;
    @Column(name = "fecha_fin_estimada")
    private LocalDate fechaFinEstimada;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "estado_etapa") // Asegúrate de que este ENUM exista en tu DB
    private EstadoEtapa estado;

    public enum EstadoEtapa {
        pendiente, en_progreso, completada, atrasada // Coincide con tu Actividad.java
    }

    public Etapa() {}

    // --- GETTERS Y SETTERS ---
    public Long getIdEtapa() {
        return idEtapa;
    }

    public void setIdEtapa(Long idEtapa) {
        this.idEtapa = idEtapa;
    }

    public Proyecto getProyecto() {
        return proyecto;
    }

    public void setProyecto(Proyecto proyecto) {
        this.proyecto = proyecto;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    // ELIMINADO: public Integer getOrden() { return orden; }
    // ELIMINADO: public void setOrden(Integer orden) { this.orden = orden; }

    public LocalDate getFechaInicioEstimada() {
        return fechaInicioEstimada;
    }

    public void setFechaInicioEstimada(LocalDate fechaInicioEstimada) {
        this.fechaInicioEstimada = fechaInicioEstimada;
    }

    public LocalDate getFechaFinEstimada() {
        return fechaFinEstimada;
    }

    public void setFechaFinEstimada(LocalDate fechaFinEstimada) {
        this.fechaFinEstimada = fechaFinEstimada;
    }

    public EstadoEtapa getEstado() {
        return estado;
    }

    public void setEstado(EstadoEtapa estado) {
        this.estado = estado;
    }
}
