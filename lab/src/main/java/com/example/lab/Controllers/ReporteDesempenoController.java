package com.example.lab.Controllers;

import com.example.lab.Models.ReporteDesempeno;
import com.example.lab.ModelsDao.ReporteDesempenoRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/reportes")
@CrossOrigin(origins = "*")
public class ReporteDesempenoController {

    private final ReporteDesempenoRepository reporteRepo;

    public ReporteDesempenoController(ReporteDesempenoRepository reporteRepo) {
        this.reporteRepo = reporteRepo;
    }

    @GetMapping
    public List<ReporteDesempeno> listarTodos() {
        return reporteRepo.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ReporteDesempeno> obtenerPorId(@PathVariable Long id) {
        return reporteRepo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/proyecto/{idProyecto}")
    public List<ReporteDesempeno> buscarPorProyecto(@PathVariable Long idProyecto) {
        return reporteRepo.findByProyecto_IdProyecto(idProyecto);
    }

    @GetMapping("/trabajador/{idTrabajador}")
    public List<ReporteDesempeno> buscarPorTrabajador(@PathVariable Long idTrabajador) {
        return reporteRepo.findByTrabajador_IdTrabajador(idTrabajador);
    }

    @PostMapping
    public ResponseEntity<ReporteDesempeno> crear(@RequestBody ReporteDesempeno nuevo) {
        return ResponseEntity.ok(reporteRepo.save(nuevo));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @RequestBody ReporteDesempeno actualizado) {
        Optional<ReporteDesempeno> optional = reporteRepo.findById(id);
        if (optional.isPresent()) {
            actualizado.setIdReporte(id);
            return ResponseEntity.ok(reporteRepo.save(actualizado));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Long id) {
        if (reporteRepo.existsById(id)) {
            reporteRepo.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
