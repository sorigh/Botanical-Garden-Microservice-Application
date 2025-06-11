package com.botanical.specimen_service.controller;

import com.botanical.specimen_service.domain.dto.SpecimenDTO;
import com.botanical.specimen_service.service.ExporterService;
import com.botanical.specimen_service.service.SpecimenService;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/specimens")  // schimbat endpointul să fie consistent cu "specimens"
public class SpecimenController {

    @Autowired
    private SpecimenService specimenService;

    @Autowired
    private ExporterService exporterService;

    @GetMapping("/{id}")
    public ResponseEntity<SpecimenDTO> getSpecimenById(@PathVariable("id") int id) {
        SpecimenDTO specimenDTO = specimenService.getSpecimenById(id);
        if (specimenDTO == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(specimenDTO);
    }

    @GetMapping
    public ResponseEntity<List<SpecimenDTO>> getAllSpecimens() {
        List<SpecimenDTO> allSpecimens = specimenService.getAllSpecimens();
        return ResponseEntity.ok(allSpecimens);
    }

    @PostMapping
    public ResponseEntity<SpecimenDTO> createSpecimen(@RequestBody SpecimenDTO specimenDTO) {
        SpecimenDTO created = specimenService.createSpecimen(specimenDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SpecimenDTO> updateSpecimen(@PathVariable int id, @RequestBody SpecimenDTO specimenDTO) {
        SpecimenDTO updated = specimenService.updateSpecimen(id, specimenDTO);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSpecimen(@PathVariable int id) {
        boolean deleted = specimenService.deleteSpecimen(id);
        if (!deleted) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/export")
    public void exportSpecimens(
            @RequestParam(defaultValue = "csv") String format,
            HttpServletResponse response) throws Exception {

        if (!exporterService.supports(format)) {
            response.setStatus(HttpStatus.BAD_REQUEST.value());
            response.getWriter().write("Unsupported format: " + format);
            return;
        }

        var exporter = exporterService.getExporter(format);
        var specimens = specimenService.getAllSpecimens();

        response.setContentType(exporter.getContentType());
        response.setHeader("Content-Disposition", "attachment; filename=specimens" + exporter.getFileExtension());
        exporter.export(specimens);
    }



}
