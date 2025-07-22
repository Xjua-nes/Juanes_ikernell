package com.example.lab.Models;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "asignaciones",
        uniqueConstraints = @UniqueConstraint(columnNames = {"id_proyecto", "id_desarrollador", "activo"}))
public class Asignacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idAsignacion;

    @ManyToOne
    @JoinColumn(name = "id_proyecto", nullable = false)
    private Proyecto proyecto;

    @ManyToOne
    @JoinColumn(name = "id_desarrollador", nullable = false)
    private Trabajador desarrollador;

    @Column(name = "fecha_asignacion", nullable = false)
    private LocalDate fechaAsignacion;

    private Boolean activo;

    public Asignacion() {
        this.activo = true;
        this.fechaAsignacion = LocalDate.now();
    }

    // --- GETTERS Y SETTERS ---

    public Long getIdAsignacion() {
        return idAsignacion;
    }

    public void setIdAsignacion(Long idAsignacion) {
        this.idAsignacion = idAsignacion;
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

    public LocalDate getFechaAsignacion() {
        return fechaAsignacion;
    }

    public void setFechaAsignacion(LocalDate fechaAsignacion) {
        this.fechaAsignacion = fechaAsignacion;
    }

    public Boolean getActivo() {
        return activo;
    }

    public void setActivo(Boolean activo) {
        this.activo = activo;
    }
}
