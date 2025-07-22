// src/main/java/com/example/lab/Controllers/TrabajadorController.java
package com.example.lab.Controllers;

import com.example.lab.Models.Trabajador;
import com.example.lab.Models.Rol;
import com.example.lab.ModelsDao.TrabajadorRepository;
import com.example.lab.ModelsDao.RolRepository;
import com.example.lab.utils.EmailService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/trabajadores")
@CrossOrigin(origins = "*") // Permite solicitudes desde cualquier origen (ajusta en producción)
public class TrabajadorController {

    private final TrabajadorRepository trabajadorRepository;
    private final RolRepository rolRepository;
    private final EmailService emailService;

    public TrabajadorController(TrabajadorRepository trabajadorRepository, RolRepository rolRepository, EmailService emailService) {
        this.trabajadorRepository = trabajadorRepository;
        this.rolRepository = rolRepository;
        this.emailService = emailService;
    }

    // Nuevo endpoint: Obtener solo los trabajadores con el rol 'Líder'
    // ¡IMPORTANTE: Este método debe ir ANTES que el @GetMapping("/{id}")!
    @GetMapping("/leaders")
    public ResponseEntity<List<Trabajador>> getLeaders() {
        // Asume que tienes un método findByRol_Nombre en TrabajadorRepository
        // Asegúrate de que el rol 'Líder' exista en tu tabla de roles
        List<Trabajador> leaders = trabajadorRepository.findByRol_Nombre("Líder");
        return ResponseEntity.ok(leaders);
    }

    // 1. Listar trabajadores (activos, inactivos o todos)
    @GetMapping
    public List<Trabajador> listarTrabajadores(@RequestParam(required = false) Boolean activo) {
        if (activo != null) {
            return trabajadorRepository.findByActivo(activo);
        }
        return trabajadorRepository.findAll();
    }

    // Buscar trabajador por email
    @GetMapping("/buscar-email")
    public ResponseEntity<Trabajador> buscarPorEmail(@RequestParam String email) {
        return trabajadorRepository.findByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 2. Obtener trabajador por ID
    // Este endpoint debe ir DESPUÉS de cualquier otro @GetMapping con sub-rutas fijas
    @GetMapping("/{id}")
    public ResponseEntity<Trabajador> obtenerTrabajador(@PathVariable Long id) {
        return trabajadorRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 3. Crear nuevo trabajador
    @PostMapping
    public ResponseEntity<Trabajador> crearTrabajador(@RequestBody Trabajador trabajador) {
        // Validación del rol
        if (trabajador.getRol() != null && trabajador.getRol().getIdRol() != null) {
            Optional<Rol> rolOptional = rolRepository.findById(trabajador.getRol().getIdRol());
            if (rolOptional.isPresent()) {
                trabajador.setRol(rolOptional.get());
            } else {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Rol con ID " + trabajador.getRol().getIdRol() + " no encontrado.");
            }
        } else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Se requiere un ID de Rol para crear un trabajador.");
        }

        String plainPassword = trabajador.getContrasena();
        if (plainPassword != null && !plainPassword.isEmpty()) {
            trabajador.setContrasena(plainPassword);
        } else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Se requiere una contraseña para crear un trabajador.");
        }

        trabajador.setActivo(true);

        String resetToken = UUID.randomUUID().toString();
        trabajador.setResetToken(resetToken);
        trabajador.setResetTokenExpiryDate(LocalDateTime.now().plusHours(24));

        Trabajador savedTrabajador = trabajadorRepository.save(trabajador);

        Optional<Trabajador> reloadedTrabajadorOptional = trabajadorRepository.findById(savedTrabajador.getIdTrabajador());
        if (reloadedTrabajadorOptional.isEmpty()) {
            System.err.println("Error: Trabajador recién guardado no encontrado al recargar.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
        Trabajador reloadedTrabajador = reloadedTrabajadorOptional.get();

        if (reloadedTrabajador.getEmail() != null && !reloadedTrabajador.getEmail().isEmpty()) {
            emailService.sendRegistrationEmail(reloadedTrabajador, plainPassword);
        } else {
            System.err.println("No se pudo enviar correo de bienvenida: el trabajador con ID " + reloadedTrabajador.getIdTrabajador() + " no tiene email.");
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(savedTrabajador);
    }

    // 4. Actualizar trabajador
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarTrabajador(@PathVariable Long id, @RequestBody Trabajador nuevo) {
        Optional<Trabajador> optional = trabajadorRepository.findById(id);
        if (optional.isPresent()) {
            Trabajador t = optional.get();
            t.setNombre(nuevo.getNombre());
            t.setApellido(nuevo.getApellido());
            t.setEmail(nuevo.getEmail());
            t.setIdentificacion(nuevo.getIdentificacion());
            t.setDireccion(nuevo.getDireccion());
            t.setProfesion(nuevo.getProfesion());
            t.setEspecialidad(nuevo.getEspecialidad());

            if (nuevo.getRol() != null && nuevo.getRol().getIdRol() != null) {
                Optional<Rol> rolOptional = rolRepository.findById(nuevo.getRol().getIdRol());
                if (rolOptional.isPresent()) {
                    t.setRol(rolOptional.get());
                } else {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Rol con ID " + nuevo.getRol().getIdRol() + " no encontrado.");
                }
            } else {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Se requiere un ID de Rol para actualizar un trabajador.");
            }

            if (nuevo.getContrasena() != null && !nuevo.getContrasena().isEmpty()) {
                t.setContrasena(nuevo.getContrasena());
            }
            return ResponseEntity.ok(trabajadorRepository.save(t));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // 5. Inhabilitar trabajador (soft delete)
    @PutMapping("/inhabilitar/{id}")
    public ResponseEntity<?> inhabilitarTrabajador(@PathVariable Long id) {
        Optional<Trabajador> optional = trabajadorRepository.findById(id);
        if (optional.isPresent()) {
            Trabajador t = optional.get();
            t.setActivo(false);
            return ResponseEntity.ok(trabajadorRepository.save(t));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // 6. Habilitar trabajador
    @PutMapping("/habilitar/{id}")
    public ResponseEntity<?> habilitarTrabajador(@PathVariable Long id) {
        Optional<Trabajador> optional = trabajadorRepository.findById(id);
        if (optional.isPresent()) {
            Trabajador t = optional.get();
            t.setActivo(true);
            return ResponseEntity.ok(trabajadorRepository.save(t));
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // 7. Eliminar totalmente (opcional)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarTrabajador(@PathVariable Long id) {
        if (trabajadorRepository.existsById(id)) {
            trabajadorRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    // --- NUEVOS ENDPOINTS PARA RESTABLECIMIENTO DE CONTRASEÑA ---

    static class PasswordResetRequest {
        private String email;

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
    }

    @PostMapping("/request-password-reset")
    public ResponseEntity<String> requestPasswordReset(@RequestBody PasswordResetRequest request) {
        Optional<Trabajador> trabajadorOptional = trabajadorRepository.findByEmail(request.getEmail());

        if (trabajadorOptional.isPresent()) {
            Trabajador trabajador = trabajadorOptional.get();
            String resetToken = UUID.randomUUID().toString();
            trabajador.setResetToken(resetToken);
            trabajador.setResetTokenExpiryDate(LocalDateTime.now().plusHours(24));
            trabajadorRepository.save(trabajador);

            emailService.sendPasswordResetLink(trabajador);
            return ResponseEntity.ok("Si el email está registrado, se ha enviado un enlace de restablecimiento de contraseña.");
        } else {
            return ResponseEntity.ok("Si el email está registrado, se ha enviado un enlace de restablecimiento de contraseña.");
        }
    }

    static class PasswordResetConfirmation {
        private String token;
        private String newPassword;

        public String getToken() { return token; }
        public void setToken(String token) { this.token = token; }
        public String getNewPassword() { return newPassword; }
        public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody PasswordResetConfirmation confirmation) {
        Optional<Trabajador> trabajadorOptional = trabajadorRepository.findByResetToken(confirmation.getToken());

        if (trabajadorOptional.isPresent()) {
            Trabajador trabajador = trabajadorOptional.get();

            if (trabajador.getResetTokenExpiryDate() == null || trabajador.getResetTokenExpiryDate().isBefore(LocalDateTime.now())) {
                trabajador.setResetToken(null);
                trabajador.setResetTokenExpiryDate(null);
                trabajadorRepository.save(trabajador);
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El token de restablecimiento ha expirado o no es válido.");
            }

            trabajador.setContrasena(confirmation.getNewPassword());
            trabajador.setResetToken(null);
            trabajador.setResetTokenExpiryDate(null);

            trabajadorRepository.save(trabajador);
            return ResponseEntity.ok("Contraseña restablecida exitosamente.");
        } else {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El token de restablecimiento no es válido.");
        }
    }
}
