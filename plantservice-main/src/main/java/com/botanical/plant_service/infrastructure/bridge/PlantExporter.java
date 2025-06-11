package com.botanical.plant_service.infrastructure.bridge;


import com.botanical.plant_service.domain.dto.PlantDTO;

import java.util.List;

public class PlantExporter {
    protected ExportFormat exportFormat;

    public PlantExporter(ExportFormat exportFormat) {
        this.exportFormat = exportFormat;
    }

    public void exportToFile(List<PlantDTO> plants, String filePath) throws Exception {
        exportFormat.export(plants, filePath);
    }

    public byte[] exportToBytes(List<PlantDTO> plants) throws Exception {
        return exportFormat.exportAsBytes(plants);
    }
}
