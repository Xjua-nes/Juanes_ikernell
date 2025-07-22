package com.example.lab.ModelsDao;


import com.example.lab.Models.Error;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ErrorRepository extends JpaRepository<Error, Long> {
    List<Error> findByDesarrolladorIdTrabajador(Long idDesarrollador);
    List<Error> findByProyectoIdProyecto(Long idProyecto);
    List<Error> findByActividadIdActividad(Long idActividad);
}
