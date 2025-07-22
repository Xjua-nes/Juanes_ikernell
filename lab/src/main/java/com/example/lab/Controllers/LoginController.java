package com.example.lab.Controllers;

import com.example.lab.Models.Trabajador;
import com.example.lab.ModelsDao.TrabajadorRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class LoginController {

    private final TrabajadorRepository trabajadorRepository;

    public LoginController(TrabajadorRepository trabajadorRepository) {
        this.trabajadorRepository = trabajadorRepository;
    }

    // DTO para recibir el login
    public static class LoginRequest {
        public String email;
        public String contrasena;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest login) {
        Optional<Trabajador> optional = trabajadorRepository
                .findByEmailAndContrasena(login.email, login.contrasena);

        if (optional.isPresent()) {
            Trabajador trabajador = optional.get();

            // Evitar enviar la contraseña
            trabajador.setContrasena(null);

            return ResponseEntity.ok(trabajador);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Credenciales incorrectas");
        }
    }
}
