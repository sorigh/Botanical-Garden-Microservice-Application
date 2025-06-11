package com.botanical.plant_service.controller;

import com.botanical.plant_service.domain.dto.PlantDTO;
import com.botanical.plant_service.service.PlantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/plants")
public class PlantController {

    @Autowired
    private PlantService plantService;


    @GetMapping
    public ResponseEntity<List<PlantDTO>> getPlantsFiltered(
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "type", required = false) String type,
            @RequestParam(value = "species", required = false) String species,
            @RequestParam(value = "carnivore", required = false) Boolean carnivore,
            @RequestParam(value = "sortBy", required = false, defaultValue = "name") String sortBy,
            @RequestParam(value = "order", required = false, defaultValue = "asc") String order
    ) {
        List<PlantDTO> filteredPlants = plantService.getFilteredPlants(search, type, species, carnivore, sortBy, order);
        return ResponseEntity.ok(filteredPlants);
    }



    @GetMapping("/{id}")
    public ResponseEntity<PlantDTO> getPlantDetails(@PathVariable("id") int id) {
        PlantDTO plant = plantService.getPlantById(id);
        return ResponseEntity.status(HttpStatus.OK).body(plant);
    }

    @PostMapping
    public ResponseEntity<PlantDTO> createPlant(@RequestBody PlantDTO plantDTO) {
        System.out.println("[DEBUG] Received plant to create: " + plantDTO);
        PlantDTO created = plantService.createPlant(plantDTO);
        System.out.println("[DEBUG] Created plant: " + created);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PlantDTO> updatePlant(@PathVariable int id, @RequestBody PlantDTO employeeDTO) {
        PlantDTO updated = plantService.updatePlant(id, employeeDTO);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlant(@PathVariable int id) {
        boolean deleted = plantService.deletePlant(id);
        if (!deleted) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/export")
    public ResponseEntity<String> exportPlants(
            @RequestParam("format") String format,
            @RequestParam("filePath") String filePath,
            @RequestBody List<PlantDTO> plantDTOs
    ) {
        try {
            plantService.exportPlantsDTO(format, plantDTOs, filePath);
            return ResponseEntity.ok("Export completed successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Export failed: " + e.getMessage());
        }
    }

    @GetMapping("/export")
    public ResponseEntity<byte[]> exportPlants(@RequestParam("format") String format) {
        try {
            byte[] fileBytes = plantService.exportPlantsAsBytes(format);

            String contentType;
            String extension;
            switch (format.toLowerCase()) {
                case "csv":
                    contentType = "text/csv";
                    extension = "csv";
                    break;
                case "doc":
                    contentType = "application/msword";
                    extension = "doc";
                    break;
                case "json":
                    contentType = "application/json";
                    extension = "json";
                    break;
                default:
                    contentType = "application/octet-stream";
                    extension = format.toLowerCase();
            }

            // Create HTTP headers for file download
            String filename = "plants_export_" + java.time.LocalDate.now() + "." + extension;

            return ResponseEntity.ok()
                    .header("Content-Disposition", "attachment; filename=\"" + filename + "\"")
                    .header("Content-Type", contentType)
                    .body(fileBytes);

        } catch (Exception e) {
            // Log error and return 500 status with message
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }





}