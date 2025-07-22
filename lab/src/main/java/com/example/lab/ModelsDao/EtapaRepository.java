package com.example.lab.ModelsDao;

import com.example.lab.Models.Etapa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EtapaRepository extends JpaRepository<Etapa, Long> {

    List<Etapa> findByProyecto_IdProyecto(Long idProyecto);
}
