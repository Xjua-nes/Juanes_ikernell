package com.example.lab.Controllers;

import com.example.lab.Models.Interrupcion;
import com.example.lab.Models.Actividad;
import com.example.lab.Models.Proyecto;
import com.example.lab.Models.Trabajador;
import com.example.lab.ModelsDao.InterrupcionRepository;
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
@RequestMapping("/api/interrupciones")
@CrossOrigin(origins = "http://localhost:3000")
public class InterrupcionController {

    @Autowired
    private InterrupcionRepository interrupcionRepository;
    @Autowired
    private ActividadRepository actividadRepository;
    @Autowired
    private ProyectoRepository proyectoRepository;
    @Autowired
    private TrabajadorRepository trabajadorRepository;

    @GetMapping
    public List<Interrupcion> getAllInterrupciones() {
        return interrupcionRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Interrupcion> getInterrupcionById(@PathVariable Long id) {
        return interrupcionRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Interrupcion> createInterrupcion(@RequestBody Interrupcion interrupcion) {
        try {
            // Lógica de servicio integrada
            if (interrupcion.getActividad() != null && interrupcion.getActividad().getIdActividad() != null) {
                Actividad actividad = actividadRepository.findById(interrupcion.getActividad().getIdActividad())
                        .orElseThrow(() -> new RuntimeException("Actividad no encontrada con ID: " + interrupcion.getActividad().getIdActividad()));
                interrupcion.setActividad(actividad);
            }
            if (interrupcion.getProyecto() != null && interrupcion.getProyecto().getIdProyecto() != null) {
                Proyecto proyecto = proyectoRepository.findById(interrupcion.getProyecto().getIdProyecto())
                        .orElseThrow(() -> new RuntimeException("Proyecto no encontrado con ID: " + interrupcion.getProyecto().getIdProyecto()));
                interrupcion.setProyecto(proyecto);
            }
            if (interrupcion.getDesarrollador() != null && interrupcion.getDesarrollador().getIdTrabajador() != null) {
                Trabajador desarrollador = trabajadorRepository.findById(interrupcion.getDesarrollador().getIdTrabajador())
                        .orElseThrow(() -> new RuntimeException("Desarrollador no encontrado con ID: " + interrupcion.getDesarrollador().getIdTrabajador()));
                interrupcion.setDesarrollador(desarrollador);
            } else {
                throw new IllegalArgumentException("El ID del desarrollador es obligatorio para registrar una interrupción.");
            }

            if (interrupcion.getFechaInterrupcion() == null) {
                interrupcion.setFechaInterrupcion(LocalDate.now());
            }
            Interrupcion createdInterrupcion = interrupcionRepository.save(interrupcion);
            return new ResponseEntity<>(createdInterrupcion, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Interrupcion> updateInterrupcion(@PathVariable Long id, @RequestBody Interrupcion interrupcionDetails) {
        try {
            Interrupcion interrupcion = interrupcionRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Interrupción no encontrada con ID: " + id));

            interrupcion.setTipoInterrupcion(interrupcionDetails.getTipoInterrupcion());
            interrupcion.setFechaInterrupcion(interrupcionDetails.getFechaInterrupcion());
            interrupcion.setDuracionMinutos(interrupcionDetails.getDuracionMinutos());
            interrupcion.setFaseProyecto(interrupcionDetails.getFaseProyecto());
            interrupcion.setDescripcion(interrupcionDetails.getDescripcion());

            if (interrupcionDetails.getActividad() != null && interrupcionDetails.getActividad().getIdActividad() != null) {
                Actividad actividad = actividadRepository.findById(interrupcionDetails.getActividad().getIdActividad())
                        .orElseThrow(() -> new RuntimeException("Actividad no encontrada con ID: " + interrupcionDetails.getActividad().getIdActividad()));
                interrupcion.setActividad(actividad);
            } else if (interrupcionDetails.getActividad() == null) {
                interrupcion.setActividad(null);
            }

            if (interrupcionDetails.getProyecto() != null && interrupcionDetails.getProyecto().getIdProyecto() != null) {
                Proyecto proyecto = proyectoRepository.findById(interrupcionDetails.getProyecto().getIdProyecto())
                        .orElseThrow(() -> new RuntimeException("Proyecto no encontrado con ID: " + interrupcionDetails.getProyecto().getIdProyecto()));
                interrupcion.setProyecto(proyecto);
            } else if (interrupcionDetails.getProyecto() == null) {
                interrupcion.setProyecto(null);
            }

            if (interrupcionDetails.getDesarrollador() != null && interrupcionDetails.getDesarrollador().getIdTrabajador() != null) {
                Trabajador desarrollador = trabajadorRepository.findById(interrupcionDetails.getDesarrollador().getIdTrabajador())
                        .orElseThrow(() -> new RuntimeException("Desarrollador no encontrado con ID: " + interrupcionDetails.getDesarrollador().getIdTrabajador()));
                interrupcion.setDesarrollador(desarrollador);
            } else {
                throw new IllegalArgumentException("El ID del desarrollador es obligatorio para actualizar una interrupción.");
            }

            Interrupcion updatedInterrupcion = interrupcionRepository.save(interrupcion);
            return ResponseEntity.ok(updatedInterrupcion);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInterrupcion(@PathVariable Long id) {
        try {
            Interrupcion interrupcion = interrupcionRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Interrupción no encontrada con ID: " + id));
            interrupcionRepository.delete(interrupcion);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
