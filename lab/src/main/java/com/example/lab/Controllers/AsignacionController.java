package com.example.lab.Controllers;

import com.example.lab.Models.Asignacion;
import com.example.lab.Models.Proyecto;
import com.example.lab.Models.Trabajador;
import com.example.lab.ModelsDao.AsignacionRepository;
import com.example.lab.ModelsDao.ProyectoRepository;
import com.example.lab.ModelsDao.TrabajadorRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/asignaciones")
@CrossOrigin(origins = "*")
public class AsignacionController {

    private final AsignacionRepository asignacionRepository;
    private final ProyectoRepository proyectoRepository;
    private final TrabajadorRepository trabajadorRepository;

    public AsignacionController(AsignacionRepository asignacionRepository,
                                ProyectoRepository proyectoRepository,
                                TrabajadorRepository trabajadorRepository) {
        this.asignacionRepository = asignacionRepository;
        this.proyectoRepository = proyectoRepository;
        this.trabajadorRepository = trabajadorRepository;
    }

    @GetMapping
    public List<Asignacion> listar() {
        return asignacionRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Asignacion> obtener(@PathVariable Long id) {
        return asignacionRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/proyecto/{idProyecto}")
    public List<Asignacion> listarAsignacionesPorProyecto(@PathVariable Long idProyecto) {
        return asignacionRepository.findByProyecto_IdProyecto(idProyecto);
    }


    @GetMapping("/desarrollador/{idDesarrollador}")
    public List<Asignacion> listarAsignacionesPorDesarrollador(@PathVariable Long idDesarrollador) {
        return asignacionRepository.findByDesarrollador_IdTrabajador(idDesarrollador);
    }

    @PostMapping
    public ResponseEntity<Asignacion> crear(@RequestBody Asignacion asignacion) {
        //asignar Proyecto
        if (asignacion.getProyecto() == null || asignacion.getProyecto().getIdProyecto() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El ID del proyecto es obligatorio para la asignación.");
        }
        Optional<Proyecto> proyectoOptional = proyectoRepository.findById(asignacion.getProyecto().getIdProyecto());
        if (proyectoOptional.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Proyecto con ID " + asignacion.getProyecto().getIdProyecto() + " no encontrado.");
        }
        asignacion.setProyecto(proyectoOptional.get());

        // asignar Desarrollador
        if (asignacion.getDesarrollador() == null || asignacion.getDesarrollador().getIdTrabajador() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El ID del desarrollador es obligatorio para la asignación.");
        }
        Optional<Trabajador> desarrolladorOptional = trabajadorRepository.findById(asignacion.getDesarrollador().getIdTrabajador());
        if (desarrolladorOptional.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Desarrollador con ID " + asignacion.getDesarrollador().getIdTrabajador() + " no encontrado.");
        }
        asignacion.setDesarrollador(desarrolladorOptional.get());

        //no puede estar dos veces en el proyecto
        Optional<Asignacion> existingActiveAssignment = asignacionRepository.findByProyecto_IdProyectoAndDesarrollador_IdTrabajadorAndActivoTrue(
                asignacion.getProyecto().getIdProyecto(), asignacion.getDesarrollador().getIdTrabajador());
        if (existingActiveAssignment.isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El desarrollador ya está asignado activamente a este proyecto.");
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(asignacionRepository.save(asignacion));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody Asignacion nueva) {
        Optional<Asignacion> optional = asignacionRepository.findById(id);
        if (optional.isPresent()) {
            Asignacion a = optional.get();

            // Act pro
            if (nueva.getProyecto() != null && nueva.getProyecto().getIdProyecto() != null &&
                    !nueva.getProyecto().getIdProyecto().equals(a.getProyecto().getIdProyecto())) {
                Optional<Proyecto> proyectoOptional = proyectoRepository.findById(nueva.getProyecto().getIdProyecto());
                if (proyectoOptional.isEmpty()) {
                    throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Proyecto con ID " + nueva.getProyecto().getIdProyecto() + " no encontrado para actualizar.");
                }
                a.setProyecto(proyectoOptional.get());
            }

            // Act Desa
            if (nueva.getDesarrollador() != null && nueva.getDesarrollador().getIdTrabajador() != null &&
                    !nueva.getDesarrollador().getIdTrabajador().equals(a.getDesarrollador().getIdTrabajador())) {
                Optional<Trabajador> desarrolladorOptional = trabajadorRepository.findById(nueva.getDesarrollador().getIdTrabajador());
                if (desarrolladorOptional.isEmpty()) {
                    throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Desarrollador con ID " + nueva.getDesarrollador().getIdTrabajador() + " no encontrado para actualizar.");
                }
                a.setDesarrollador(desarrolladorOptional.get());
            }

            // Actualizar fe-act
            if (nueva.getFechaAsignacion() != null) a.setFechaAsignacion(nueva.getFechaAsignacion());
            if (nueva.getActivo() != null) a.setActivo(nueva.getActivo());

            if (nueva.getActivo() != null && nueva.getActivo() &&
                    asignacionRepository.findByProyecto_IdProyectoAndDesarrollador_IdTrabajadorAndActivoTrue(
                                    a.getProyecto().getIdProyecto(), a.getDesarrollador().getIdTrabajador())
                            .filter(existing -> !existing.getIdAsignacion().equals(a.getIdAsignacion()))
                            .isPresent()) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "No se puede activar la asignación, ya existe otra asignación activa para este desarrollador en este proyecto.");
            }


            return ResponseEntity.ok(asignacionRepository.save(a));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        if (!asignacionRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        asignacionRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
