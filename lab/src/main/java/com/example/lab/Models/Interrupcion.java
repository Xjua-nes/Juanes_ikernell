package com.example.lab.Models;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "interrupciones") // Nombre de la tabla en la base de datos
public class Interrupcion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idInterrupcion;

    @Column(nullable = false)
    private String tipoInterrupcion; // Ej: Reunión, Problema técnico, Ausencia

    @Column(nullable = false)
    private LocalDate fechaInterrupcion;

    @Column(nullable = false)
    private Integer duracionMinutos; // Duración de la interrupción en minutos

    @Column(nullable = false)
    private String faseProyecto; // Fase del proyecto donde ocurrió la interrupción

    @Column(columnDefinition = "TEXT")
    private String descripcion; // Descripción opcional

    // Relación opcional con Actividad (si la interrupción se asocia a una actividad específica)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_actividad")
    private Actividad actividad;

    // Relación opcional con Proyecto (si la interrupción se asocia directamente a un proyecto)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_proyecto")
    private Proyecto proyecto;

    // Relación con el desarrollador que reporta la interrupción
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_desarrollador", nullable = false) // Asumimos que el desarrollador es obligatorio
    private Trabajador desarrollador;

    // Getters y Setters
    public Long getIdInterrupcion() {
        return idInterrupcion;
    }

    public void setIdInterrupcion(Long idInterrupcion) {
        this.idInterrupcion = idInterrupcion;
    }

    public String getTipoInterrupcion() {
        return tipoInterrupcion;
    }

    public void setTipoInterrupcion(String tipoInterrupcion) {
        this.tipoInterrupcion = tipoInterrupcion;
    }

    public LocalDate getFechaInterrupcion() {
        return fechaInterrupcion;
    }

    public void setFechaInterrupcion(LocalDate fechaInterrupcion) {
        this.fechaInterrupcion = fechaInterrupcion;
    }

    public Integer getDuracionMinutos() {
        return duracionMinutos;
    }

    public void setDuracionMinutos(Integer duracionMinutos) {
        this.duracionMinutos = duracionMinutos;
    }

    public String getFaseProyecto() {
        return faseProyecto;
    }

    public void setFaseProyecto(String faseProyecto) {
        this.faseProyecto = faseProyecto;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public Actividad getActividad() {
        return actividad;
    }

    public void setActividad(Actividad actividad) {
        this.actividad = actividad;
    }

    public Proyecto getProyecto() {
        return proyecto;
    }

    public void setProyecto(Proyecto proyecto) {
        this.proyecto = proyecto;
    }

    public Trabajador getDesarrollador() {
        return desarrollador;
    }

    public void setDesarrollador(Trabajador desarrollador) {
        this.desarrollador = desarrollador;
    }
}
