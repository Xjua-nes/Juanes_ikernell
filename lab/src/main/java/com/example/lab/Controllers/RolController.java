package com.example.lab.Controllers;

import com.example.lab.Models.Rol;
import com.example.lab.ModelsDao.RolRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * Controlador para la gestión de roles.
 * Permite listar, obtener, crear, actualizar y eliminar roles.
 */
@RestController
@RequestMapping("/api/roles")
@CrossOrigin(origins = "*") // Permite solicitudes desde cualquier origen (ajustar en producción)
public class RolController {

    private final RolRepository rolRepository;

    public RolController(RolRepository rolRepository) {
        this.rolRepository = rolRepository;
    }

    /**
     * Obtiene una lista de todos los roles.
     * @return Lista de objetos Rol.
     */
    @GetMapping
    public List<Rol> listarRoles() {
        return rolRepository.findAll();
    }

    /**
     * Obtiene un rol específico por su ID.
     * @param id ID del rol.
     * @return Optional que contiene el Rol si se encuentra, o vacío si no.
     */
    @GetMapping("/{id}")
    public Optional<Rol> obtenerRol(@PathVariable Long id) {
        return rolRepository.findById(id);
    }

    /**
     * Crea un nuevo rol.
     * @param rol Objeto Rol a crear.
     * @return El Rol creado.
     */
    @PostMapping
    public Rol crearRol(@RequestBody Rol rol) {
        return rolRepository.save(rol);
    }

    /**
     * Actualiza un rol existente.
     * @param id ID del rol a actualizar.
     * @param rol Objeto Rol con los datos actualizados.
     * @return El Rol actualizado.
     * @throws RuntimeException si el rol no se encuentra.
     */
    @PutMapping("/{id}")
    public Rol actualizarRol(@PathVariable Long id, @RequestBody Rol rol) {
        Rol r = rolRepository.findById(id).orElseThrow(() -> new RuntimeException("Rol no encontrado"));
        r.setNombre(rol.getNombre());
        return rolRepository.save(r);
    }

    /**
     * Elimina un rol por su ID.
     * @param id ID del rol a eliminar.
     */
    @DeleteMapping("/{id}")
    public void eliminarRol(@PathVariable Long id) {
        rolRepository.deleteById(id);
    }
}

