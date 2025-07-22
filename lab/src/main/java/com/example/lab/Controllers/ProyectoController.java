// src/main/java/com/example/lab/Controllers/ProyectoController.java
package com.example.lab.Controllers;

import com.example.lab.Models.Proyecto;
import com.example.lab.Models.Trabajador;
import com.example.lab.Models.Proyecto.EstadoProyecto;
import com.example.lab.ModelsDao.ProyectoRepository;
import com.example.lab.ModelsDao.TrabajadorRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/proyectos")
@CrossOrigin(origins = "*") // Permite solicitudes desde cualquier origen (ajusta en producción)
public class ProyectoController {

    private final ProyectoRepository proyectoRepository;
    private final TrabajadorRepository trabajadorRepository;

    // Inyección de dependencias a través del constructor
    public ProyectoController(ProyectoRepository proyectoRepository, TrabajadorRepository trabajadorRepository) {
        this.proyectoRepository = proyectoRepository;
        this.trabajadorRepository = trabajadorRepository;
    }

    // 1. Listar todos los proyectos
    @GetMapping
    public List<Proyecto> listarProyectos() {
        return proyectoRepository.findAll();
    }

    // 2. Obtener un proyecto por ID
    @GetMapping("/{id}")
    public ResponseEntity<Proyecto> obtenerProyectoPorId(@PathVariable Long id) {
        return proyectoRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 3. Crear nuevo proyecto
    @PostMapping
    public ResponseEntity<Proyecto> crearProyecto(@RequestBody Proyecto proyecto) {
        // Validación del líder: Asegurarse de que el ID del líder se haya proporcionado
        if (proyecto.getLider() == null || proyecto.getLider().getIdTrabajador() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El ID del líder del proyecto es obligatorio.");
        }

        // Buscar el trabajador líder en la base de datos
        Optional<Trabajador> liderOptional = trabajadorRepository.findById(proyecto.getLider().getIdTrabajador());
        if (liderOptional.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Líder con ID " + proyecto.getLider().getIdTrabajador() + " no encontrado.");
        }

        // Asignar el objeto Trabajador completo al proyecto
        proyecto.setLider(liderOptional.get());

        // Validaciones adicionales antes de guardar
        if (proyecto.getNombre() == null || proyecto.getNombre().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El nombre del proyecto es obligatorio.");
        }
        if (proyecto.getFechaInicio() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La fecha de inicio del proyecto es obligatoria.");
        }
        // Si el estado no se proporciona, establecer un valor por defecto
        if (proyecto.getEstado() == null) {
            proyecto.setEstado(EstadoProyecto.planificacion);
        }

        Proyecto nuevoProyecto = proyectoRepository.save(proyecto);
        return new ResponseEntity<>(nuevoProyecto, HttpStatus.CREATED);
    }

    // 4. Actualizar proyecto existente
    @PutMapping("/{id}")
    public ResponseEntity<Proyecto> actualizarProyecto(@PathVariable Long id, @RequestBody Proyecto proyectoDetails) {
        Optional<Proyecto> optionalProyecto = proyectoRepository.findById(id);

        if (optionalProyecto.isPresent()) {
            Proyecto proyectoExistente = optionalProyecto.get();

            // Actualizar campos si se proporcionan en los detalles
            if (proyectoDetails.getNombre() != null) {
                proyectoExistente.setNombre(proyectoDetails.getNombre());
            }
            if (proyectoDetails.getDescripcion() != null) {
                proyectoExistente.setDescripcion(proyectoDetails.getDescripcion());
            }
            if (proyectoDetails.getFechaInicio() != null) {
                proyectoExistente.setFechaInicio(proyectoDetails.getFechaInicio());
            }
            // fechaFinEstimada puede ser null
            proyectoExistente.setFechaFinEstimada(proyectoDetails.getFechaFinEstimada());

            // Actualizar el líder si se proporciona un nuevo ID de líder
            if (proyectoDetails.getLider() != null && proyectoDetails.getLider().getIdTrabajador() != null) {
                Optional<Trabajador> nuevoLiderOptional = trabajadorRepository.findById(proyectoDetails.getLider().getIdTrabajador());
                if (nuevoLiderOptional.isEmpty()) {
                    throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Nuevo líder con ID " + proyectoDetails.getLider().getIdTrabajador() + " no encontrado.");
                }
                proyectoExistente.setLider(nuevoLiderOptional.get());
            } else if (proyectoDetails.getLider() != null && proyectoDetails.getLider().getIdTrabajador() == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El ID del líder no puede ser nulo si se intenta actualizar el líder.");
            }


            // Actualizar el estado si se proporciona
            if (proyectoDetails.getEstado() != null) {
                proyectoExistente.setEstado(proyectoDetails.getEstado());
            }

            Proyecto proyectoActualizado = proyectoRepository.save(proyectoExistente);
            return ResponseEntity.ok(proyectoActualizado);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // 5. Eliminar proyecto
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarProyecto(@PathVariable Long id) {
        if (!proyectoRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        proyectoRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // 6. Cambiar estado de un proyecto
    @PutMapping("/{id}/estado")
    public ResponseEntity<?> cambiarEstado(@PathVariable Long id, @RequestParam String estado) {
        Optional<Proyecto> optionalProyecto = proyectoRepository.findById(id);
        if (optionalProyecto.isPresent()) {
            Proyecto proyecto = optionalProyecto.get();
            try {
                EstadoProyecto nuevoEstado = EstadoProyecto.valueOf(estado.toLowerCase());
                proyecto.setEstado(nuevoEstado);
                Proyecto actualizado = proyectoRepository.save(proyecto);
                return ResponseEntity.ok(actualizado);
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body("Estado inválido: " + estado + ". Estados permitidos: planificacion, en_progreso, en_revision, finalizado, cancelado.");
            }
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}

