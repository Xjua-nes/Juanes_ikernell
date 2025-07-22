// src/main/java/com/example/lab/controllers/ErrorController.java
package com.example.lab.Controllers;

import com.example.lab.Models.Error;
import com.example.lab.Models.Actividad;
import com.example.lab.Models.Proyecto;
import com.example.lab.Models.Trabajador;
import com.example.lab.ModelsDao.ErrorRepository;
import com.example.lab.ModelsDao.ActividadRepository;
import com.example.lab.ModelsDao.ProyectoRepository;
import com.example.lab.ModelsDao.TrabajadorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/errores")
@CrossOrigin(origins = "http://localhost:3000")
public class ErrorController {

    @Autowired
    private ErrorRepository errorRepository;
    @Autowired
    private ActividadRepository actividadRepository;
    @Autowired
    private ProyectoRepository proyectoRepository;
    @Autowired
    private TrabajadorRepository trabajadorRepository;

    @GetMapping
    public List<Error> getAllErrors() {
        return errorRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Error> getErrorById(@PathVariable Long id) {
        return errorRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Error> createError(@RequestBody Error error) {
        try {
            // Lógica de servicio integrada
            if (error.getActividad() != null && error.getActividad().getIdActividad() != null) {
                Actividad actividad = actividadRepository.findById(error.getActividad().getIdActividad())
                        .orElseThrow(() -> new RuntimeException("Actividad no encontrada con ID: " + error.getActividad().getIdActividad()));
                error.setActividad(actividad);
            }
            if (error.getProyecto() != null && error.getProyecto().getIdProyecto() != null) {
                Proyecto proyecto = proyectoRepository.findById(error.getProyecto().getIdProyecto())
                        .orElseThrow(() -> new RuntimeException("Proyecto no encontrado con ID: " + error.getProyecto().getIdProyecto()));
                error.setProyecto(proyecto);
            }
            if (error.getDesarrollador() != null && error.getDesarrollador().getIdTrabajador() != null) {
                Trabajador desarrollador = trabajadorRepository.findById(error.getDesarrollador().getIdTrabajador())
                        .orElseThrow(() -> new RuntimeException("Desarrollador no encontrado con ID: " + error.getDesarrollador().getIdTrabajador()));
                error.setDesarrollador(desarrollador);
            } else {
                throw new IllegalArgumentException("El ID del desarrollador es obligatorio para registrar un error.");
            }

            if (error.getFechaReporte() == null) {
                error.setFechaReporte(LocalDate.now());
            }
            Error createdError = errorRepository.save(error);
            return new ResponseEntity<>(createdError, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Error> updateError(@PathVariable Long id, @RequestBody Error errorDetails) {
        try {
            Error error = errorRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Error no encontrado con ID: " + id));

            error.setTipoError(errorDetails.getTipoError());
            error.setDescripcion(errorDetails.getDescripcion());
            error.setFaseProyecto(errorDetails.getFaseProyecto());
            error.setFechaReporte(errorDetails.getFechaReporte());

            if (errorDetails.getActividad() != null && errorDetails.getActividad().getIdActividad() != null) {
                Actividad actividad = actividadRepository.findById(errorDetails.getActividad().getIdActividad())
                        .orElseThrow(() -> new RuntimeException("Actividad no encontrada con ID: " + errorDetails.getActividad().getIdActividad()));
                error.setActividad(actividad);
            } else if (errorDetails.getActividad() == null) {
                error.setActividad(null);
            }

            if (errorDetails.getProyecto() != null && errorDetails.getProyecto().getIdProyecto() != null) {
                Proyecto proyecto = proyectoRepository.findById(errorDetails.getProyecto().getIdProyecto())
                        .orElseThrow(() -> new RuntimeException("Proyecto no encontrado con ID: " + errorDetails.getProyecto().getIdProyecto()));
                error.setProyecto(proyecto);
            } else if (errorDetails.getProyecto() == null) {
                error.setProyecto(null);
            }

            if (errorDetails.getDesarrollador() != null && errorDetails.getDesarrollador().getIdTrabajador() != null) {
                Trabajador desarrollador = trabajadorRepository.findById(errorDetails.getDesarrollador().getIdTrabajador())
                        .orElseThrow(() -> new RuntimeException("Desarrollador no encontrado con ID: " + errorDetails.getDesarrollador().getIdTrabajador()));
                error.setDesarrollador(desarrollador);
            } else {
                throw new IllegalArgumentException("El ID del desarrollador es obligatorio para actualizar un error.");
            }

            Error updatedError = errorRepository.save(error);
            return ResponseEntity.ok(updatedError);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteError(@PathVariable Long id) {
        try {
            Error error = errorRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Error no encontrado con ID: " + id));
            errorRepository.delete(error);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
