package com.botanical.plant_service.infrastructure.bridge;

import com.botanical.plant_service.domain.dto.PlantDTO;

import java.util.List;

public interface ExportFormat {
    /**
     * Export the given plants to a file at the given path.
     * @param plants List of PlantDTO to export
     * @param filePath the output file path
     * @throws Exception if export fails
     */
    void export(List<PlantDTO> plants, String filePath) throws Exception;

    /**
     * Export the given plants and return bytes representation of the export (for download).
     * @param plants List of PlantDTO to export
     * @return exported file content as bytes
     * @throws Exception if export fails
     */
    byte[] exportAsBytes(List<PlantDTO> plants) throws Exception;
}
