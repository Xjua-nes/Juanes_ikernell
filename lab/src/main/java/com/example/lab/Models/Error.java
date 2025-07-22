package com.example.lab.Models;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "errores") // Nombre de la tabla en la base de datos
public class Error {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idError;

    @Column(nullable = false)
    private String tipoError; // Ej: Bug, Lógica, UI, Integración

    @Column(nullable = false, columnDefinition = "TEXT")
    private String descripcion;

    @Column(nullable = false)
    private String faseProyecto; // Ej: Planificacion, Desarrollo, Pruebas, Despliegue

    @Column(nullable = false)
    private LocalDate fechaReporte;

    // Relación opcional con Actividad (si un error se asocia a una actividad específica)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_actividad") // Columna de la clave foránea en la tabla 'errores'
    private Actividad actividad;

    // Relación opcional con Proyecto (si un error se asocia directamente a un proyecto)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_proyecto") // Columna de la clave foránea en la tabla 'errores'
    private Proyecto proyecto;

    // Relación con el desarrollador que reporta el error
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_desarrollador", nullable = false) // Asumimos que el desarrollador es obligatorio
    private Trabajador desarrollador;

    // Getters y Setters
    public Long getIdError() {
        return idError;
    }

    public void setIdError(Long idError) {
        this.idError = idError;
    }

    public String getTipoError() {
        return tipoError;
    }

    public void setTipoError(String tipoError) {
        this.tipoError = tipoError;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getFaseProyecto() {
        return faseProyecto;
    }

    public void setFaseProyecto(String faseProyecto) {
        this.faseProyecto = faseProyecto;
    }

    public LocalDate getFechaReporte() {
        return fechaReporte;
    }

    public void setFechaReporte(LocalDate fechaReporte) {
        this.fechaReporte = fechaReporte;
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
