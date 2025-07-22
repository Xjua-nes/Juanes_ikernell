package com.example.lab.Controllers;

import com.example.lab.Models.Actividad;
import com.example.lab.Models.Etapa;
import com.example.lab.Models.Trabajador;
import com.example.lab.ModelsDao.ActividadRepository;
import com.example.lab.ModelsDao.EtapaRepository;
import com.example.lab.ModelsDao.TrabajadorRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/actividades")
@CrossOrigin(origins = "*")
public class ActividadController {

    private final ActividadRepository actividadRepository;
    private final EtapaRepository etapaRepository;
    private final TrabajadorRepository trabajadorRepository;

    public ActividadController(ActividadRepository actividadRepository,
                               EtapaRepository etapaRepository,
                               TrabajadorRepository trabajadorRepository) {
        this.actividadRepository = actividadRepository;
        this.etapaRepository = etapaRepository;
        this.trabajadorRepository = trabajadorRepository;
    }

    @GetMapping
    public List<Actividad> listar() {
        return actividadRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Actividad> obtener(@PathVariable Long id) {
        if (id == null || id <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El ID de la actividad debe ser un número positivo.");
        }
        return actividadRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/etapa/{idEtapa}")
    public ResponseEntity<List<Actividad>> listarActividadesPorEtapa(@PathVariable Long idEtapa) {
        if (idEtapa == null || idEtapa <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El ID de la etapa debe ser un número positivo.");
        }
        List<Actividad> actividades = actividadRepository.findByEtapa_IdEtapa(idEtapa);
        return ResponseEntity.ok(actividades);
    }

    @GetMapping("/desarrollador/{idDesarrollador}")
    public ResponseEntity<List<Actividad>> listarActividadesPorDesarrollador(@PathVariable Long idDesarrollador) {
        if (idDesarrollador == null || idDesarrollador <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El ID del desarrollador debe ser un número positivo.");
        }
        List<Actividad> actividades = actividadRepository.findByDesarrollador_IdTrabajador(idDesarrollador);
        return ResponseEntity.ok(actividades);
    }

    @PostMapping
    public ResponseEntity<Actividad> crear(@RequestBody Actividad actividad) {
        // Validar y asignar la Etapa
        if (actividad.getEtapa() == null || actividad.getEtapa().getIdEtapa() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El ID de la etapa es obligatorio para crear una actividad.");
        }
        Optional<Etapa> etapaOptional = etapaRepository.findById(actividad.getEtapa().getIdEtapa());
        if (etapaOptional.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Etapa con ID " + actividad.getEtapa().getIdEtapa() + " no encontrada.");
        }
        actividad.setEtapa(etapaOptional.get());

        // Validar y asignar el Desarrollador
        if (actividad.getDesarrollador() == null || actividad.getDesarrollador().getIdTrabajador() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El ID del desarrollador es obligatorio para crear una actividad.");
        }
        Optional<Trabajador> desarrolladorOptional = trabajadorRepository.findById(actividad.getDesarrollador().getIdTrabajador());
        if (desarrolladorOptional.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Desarrollador con ID " + actividad.getDesarrollador().getIdTrabajador() + " no encontrado.");
        }
        actividad.setDesarrollador(desarrolladorOptional.get());

        // Validaciones adicionales
        if (actividad.getNombre() == null || actividad.getNombre().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El nombre de la actividad es obligatorio.");
        }
        if (actividad.getEstado() == null) {
            actividad.setEstado(Actividad.EstadoActividad.pendiente); // Estado por defecto
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(actividadRepository.save(actividad));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody Actividad actualizada) {
        if (id == null || id <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El ID de la actividad debe ser un número positivo.");
        }
        Optional<Actividad> optional = actividadRepository.findById(id);
        if (optional.isPresent()) {
            Actividad a = optional.get();

            // Actualizar campos básicos
            if (actualizada.getNombre() != null) a.setNombre(actualizada.getNombre());
            if (actualizada.getDescripcion() != null) a.setDescripcion(actualizada.getDescripcion());
            if (actualizada.getFechaInicioEstimada() != null) a.setFechaInicioEstimada(actualizada.getFechaInicioEstimada());
            if (actualizada.getFechaFinEstimada() != null) a.setFechaFinEstimada(actualizada.getFechaFinEstimada());
            if (actualizada.getEstado() != null) a.setEstado(actualizada.getEstado());

            // Actualizar Etapa si se proporciona y es diferente
            if (actualizada.getEtapa() != null && actualizada.getEtapa().getIdEtapa() != null &&
                    !actualizada.getEtapa().getIdEtapa().equals(a.getEtapa().getIdEtapa())) {
                Optional<Etapa> etapaOptional = etapaRepository.findById(actualizada.getEtapa().getIdEtapa());
                if (etapaOptional.isEmpty()) {
                    throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Etapa con ID " + actualizada.getEtapa().getIdEtapa() + " no encontrada para actualizar.");
                }
                a.setEtapa(etapaOptional.get());
            }

            // Actualizar Desarrollador si se proporciona y es diferente
            if (actualizada.getDesarrollador() != null && actualizada.getDesarrollador().getIdTrabajador() != null &&
                    !actualizada.getDesarrollador().getIdTrabajador().equals(a.getDesarrollador().getIdTrabajador())) {
                Optional<Trabajador> desarrolladorOptional = trabajadorRepository.findById(actualizada.getDesarrollador().getIdTrabajador());
                if (desarrolladorOptional.isEmpty()) {
                    throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Desarrollador con ID " + actualizada.getDesarrollador().getIdTrabajador() + " no encontrado para actualizar.");
                }
                a.setDesarrollador(desarrolladorOptional.get());
            }

            return ResponseEntity.ok(actividadRepository.save(a));
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<Actividad> actualizarEstado(@PathVariable Long id, @RequestBody String newStatus) {
        if (id == null || id <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El ID de la actividad debe ser un número positivo.");
        }
        Optional<Actividad> optional = actividadRepository.findById(id);
        if (optional.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Actividad con ID " + id + " no encontrada.");
        }
        Actividad actividad = optional.get();
        try {
            Actividad.EstadoActividad estado = Actividad.EstadoActividad.valueOf(newStatus);
            actividad.setEstado(estado);
            return ResponseEntity.ok(actividadRepository.save(actividad));
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Estado inválido: " + newStatus);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        if (id == null || id <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El ID de la actividad debe ser un número positivo.");
        }
        if (!actividadRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        actividadRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}