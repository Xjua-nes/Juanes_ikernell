package com.example.lab.ModelsDao;

import com.example.lab.Models.ReporteDesempeno;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReporteDesempenoRepository extends JpaRepository<ReporteDesempeno, Long> {
    List<ReporteDesempeno> findByProyecto_IdProyecto(Long idProyecto);
    List<ReporteDesempeno> findByTrabajador_IdTrabajador(Long idTrabajador);
}
