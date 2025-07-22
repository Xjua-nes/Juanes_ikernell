package com.example.lab.ModelsDao;

import com.example.lab.Models.Trabajador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TrabajadorRepository extends JpaRepository<Trabajador, Long> {
    Optional<Trabajador> findByEmail(String email);
    Optional<Trabajador> findByEmailAndContrasena(String email, String contrasena);
    Optional<Trabajador> findByResetToken(String resetToken);
    List<Trabajador> findByActivoTrue();
    List<Trabajador> findByActivo(Boolean activo);
    List<Trabajador> findByRol_Nombre(String rolNombre); // Método para encontrar por nombre de rol
    Optional<Trabajador> findByIdentificacion(String identificacion); // Para verificar si la identificación ya existe
}

