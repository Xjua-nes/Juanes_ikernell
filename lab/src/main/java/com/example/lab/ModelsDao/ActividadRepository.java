package com.example.lab.ModelsDao;

import com.example.lab.Models.Actividad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActividadRepository extends JpaRepository<Actividad, Long> {
    // Para obtener actividades por la etapa a la que pertenecen
    List<Actividad> findByEtapa_IdEtapa(Long idEtapa);
    // Para obtener actividades asignadas a un desarrollador específico
    List<Actividad> findByDesarrollador_IdTrabajador(Long idDesarrollador);
}
