package com.botanical.plant_service.infrastructure.bridge;


import com.botanical.plant_service.domain.dto.PlantDTO;

import java.io.FileWriter;
import java.util.List;

public class CsvExportFormat implements ExportFormat {

    @Override
    public void export(List<PlantDTO> plants, String filePath) throws Exception {
        try (FileWriter writer = new FileWriter(filePath)) {
            writer.write("id,name,type,species,carnivore\n");
            for (PlantDTO p : plants) {
                writer.write(String.format("%d,%s,%s,%s,%b\n",
                        p.getPlantId(),
                        p.getName(),
                        p.getType(),
                        p.getSpecies(),
                        p.getCarnivore()));
            }
        }
    }

    @Override
    public byte[] exportAsBytes(List<PlantDTO> plants) throws Exception {
        StringBuilder sb = new StringBuilder();
        sb.append("id,name,type,species,carnivore\n");
        for (PlantDTO p : plants) {
            sb.append(String.format("%d,%s,%s,%s,%b\n",
                    p.getPlantId(),
                    p.getName(),
                    p.getType(),
                    p.getSpecies(),
                    p.getCarnivore()));
        }
        return sb.toString().getBytes();
    }
}
