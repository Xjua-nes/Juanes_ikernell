// src/main/java/com/example/lab/Controllers/EtapaController.java
package com.example.lab.Controllers;

import com.example.lab.Models.Etapa;
import com.example.lab.Models.Proyecto;
import com.example.lab.ModelsDao.EtapaRepository;
import com.example.lab.ModelsDao.ProyectoRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/etapas")
@CrossOrigin(origins = "*")
public class EtapaController {

    private final EtapaRepository etapaRepository;
    private final ProyectoRepository proyectoRepository; // Necesario para validar el proyecto

    public EtapaController(EtapaRepository etapaRepository, ProyectoRepository proyectoRepository) {
        this.etapaRepository = etapaRepository;
        this.proyectoRepository = proyectoRepository;
    }

    @GetMapping
    public List<Etapa> listar() {
        return etapaRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Etapa> obtener(@PathVariable Long id) {
        return etapaRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Nuevo endpoint para listar etapas por ID de proyecto
    @GetMapping("/proyecto/{idProyecto}")
    public List<Etapa> listarEtapasPorProyecto(@PathVariable Long idProyecto) {
        return etapaRepository.findByProyecto_IdProyecto(idProyecto);
    }

    @PostMapping
    public ResponseEntity<?> crear(@RequestBody Etapa etapa) {
        // Validar y asignar el Proyecto
        if (etapa.getProyecto() == null || etapa.getProyecto().getIdProyecto() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El ID del proyecto es obligatorio para crear una etapa.");
        }
        Optional<Proyecto> proyectoOptional = proyectoRepository.findById(etapa.getProyecto().getIdProyecto());
        if (proyectoOptional.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Proyecto con ID " + etapa.getProyecto().getIdProyecto() + " no encontrado.");
        }
        etapa.setProyecto(proyectoOptional.get());

        // Validaciones adicionales
        if (etapa.getNombre() == null || etapa.getNombre().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El nombre de la etapa es obligatorio.");
        }
        if (etapa.getEstado() == null) {
            etapa.setEstado(Etapa.EstadoEtapa.pendiente); // Estado por defecto
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(etapaRepository.save(etapa));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody Etapa actualizada) {
        Optional<Etapa> optional = etapaRepository.findById(id);
        if (optional.isPresent()) {
            Etapa e = optional.get();

            // Actualizar campos básicos
            if (actualizada.getNombre() != null) e.setNombre(actualizada.getNombre());
            // ELIMINADA: if (actualizada.getOrden() != null) e.setOrden(actualizada.getOrden());
            if (actualizada.getFechaInicioEstimada() != null) e.setFechaInicioEstimada(actualizada.getFechaInicioEstimada());
            if (actualizada.getFechaFinEstimada() != null) e.setFechaFinEstimada(actualizada.getFechaFinEstimada());
            if (actualizada.getEstado() != null) e.setEstado(actualizada.getEstado());

            // Actualizar Proyecto si se proporciona y es diferente
            if (actualizada.getProyecto() != null && actualizada.getProyecto().getIdProyecto() != null &&
                    !actualizada.getProyecto().getIdProyecto().equals(e.getProyecto().getIdProyecto())) {
                Optional<Proyecto> proyectoOptional = proyectoRepository.findById(actualizada.getProyecto().getIdProyecto());
                if (proyectoOptional.isEmpty()) {
                    throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Proyecto con ID " + actualizada.getProyecto().getIdProyecto() + " no encontrado para actualizar.");
                }
                e.setProyecto(proyectoOptional.get());
            }

            return ResponseEntity.ok(etapaRepository.save(e));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        if (!etapaRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        etapaRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
