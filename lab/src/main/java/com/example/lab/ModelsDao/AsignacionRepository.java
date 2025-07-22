package com.example.lab.ModelsDao;

import com.example.lab.Models.Asignacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AsignacionRepository extends JpaRepository<Asignacion, Long> {
    // Para obtener asignaciones por proyecto
    List<Asignacion> findByProyecto_IdProyecto(Long idProyecto);
    // Para obtener asignaciones por desarrollador
    List<Asignacion> findByDesarrollador_IdTrabajador(Long idDesarrollador);
    // Para verificar si una asignación activa ya existe para un proyecto y desarrollador
    Optional<Asignacion> findByProyecto_IdProyectoAndDesarrollador_IdTrabajadorAndActivoTrue(Long idProyecto, Long idDesarrollador);
}

