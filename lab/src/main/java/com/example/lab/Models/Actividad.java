package com.example.lab.Models;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "actividades")
public class Actividad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idActividad;

    @ManyToOne
    @JoinColumn(name = "id_etapa", nullable = false)
    private Etapa etapa;

    @ManyToOne
    @JoinColumn(name = "id_desarrollador", nullable = false)
    private Trabajador desarrollador;

    private String nombre;
    private String descripcion;
    private LocalDate fechaInicioEstimada;
    private LocalDate fechaFinEstimada;

    @Enumerated(EnumType.STRING)
    private EstadoActividad estado;

    // Enum embebido
    public enum EstadoActividad {
        pendiente, en_progreso, completada, atrasada
    }

    // Getters y Setters

    public Long getIdActividad() {
        return idActividad;
    }

    public void setIdActividad(Long idActividad) {
        this.idActividad = idActividad;
    }

    public Etapa getEtapa() {
        return etapa;
    }

    public void setEtapa(Etapa etapa) {
        this.etapa = etapa;
    }

    public Trabajador getDesarrollador() {
        return desarrollador;
    }

    public void setDesarrollador(Trabajador desarrollador) {
        this.desarrollador = desarrollador;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

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

    public EstadoActividad getEstado() {
        return estado;
    }

    public void setEstado(EstadoActividad estado) {
        this.estado = estado;
    }
}
