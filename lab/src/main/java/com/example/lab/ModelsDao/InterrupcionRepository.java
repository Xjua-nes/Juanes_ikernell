package com.example.lab.ModelsDao;

import com.example.lab.Models.Interrupcion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InterrupcionRepository extends JpaRepository<Interrupcion, Long> {
    List<Interrupcion> findByDesarrolladorIdTrabajador(Long idDesarrollador);
    List<Interrupcion> findByProyectoIdProyecto(Long idProyecto);
    List<Interrupcion> findByActividadIdActividad(Long idActividad);
}

