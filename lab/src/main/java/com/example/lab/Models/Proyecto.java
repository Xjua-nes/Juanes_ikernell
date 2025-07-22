package com.example.lab.Models;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "proyectos")
public class Proyecto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idProyecto;

    private String nombre;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    private LocalDate fechaInicio;
    private LocalDate fechaFinEstimada;

    @ManyToOne
    @JoinColumn(name = "id_lider", nullable = false)

    private Trabajador lider;

    @Enumerated(EnumType.STRING)
    private EstadoProyecto estado;

    public enum EstadoProyecto {
        planificacion, en_progreso, en_revision, finalizado, cancelado
    }

    // Constructor vacío
    public Proyecto() {}

    // --- GETTERS Y SETTERS ---
    public Long getIdProyecto() {
        return idProyecto;
    }

    public void setIdProyecto(Long idProyecto) {
        this.idProyecto = idProyecto;
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

    public LocalDate getFechaInicio() {
        return fechaInicio;
    }

    public void setFechaInicio(LocalDate fechaInicio) {
        this.fechaInicio = fechaInicio;
    }

    public LocalDate getFechaFinEstimada() {
        return fechaFinEstimada;
    }

    public void setFechaFinEstimada(LocalDate fechaFinEstimada) {
        this.fechaFinEstimada = fechaFinEstimada;
    }

    public Trabajador getLider() {
        return lider;
    }

    public void setLider(Trabajador lider) {
        this.lider = lider;
    }

    public EstadoProyecto getEstado() {
        return estado;
    }

    public void setEstado(EstadoProyecto estado) {
        this.estado = estado;
    }
}
