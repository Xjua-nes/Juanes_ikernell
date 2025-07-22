// src/main/java/com/example/lab/ModelsDao/ProyectoRepository.java
package com.example.lab.ModelsDao;

import com.example.lab.Models.Proyecto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProyectoRepository extends JpaRepository<Proyecto, Long> {
   List<Proyecto> findByLider_IdTrabajador(Long idLider);
}

