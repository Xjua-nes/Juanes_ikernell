package com.example.lab.Controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Controlador para la ruta principal de la API.
 * Proporciona un endpoint simple para verificar que la API está activa.
 */
@RestController
public class HomeController {

    @GetMapping("/")
    public Map<String, String> index() {
        return Map.of("status", "ok", "message", "API activa");
    }
}
