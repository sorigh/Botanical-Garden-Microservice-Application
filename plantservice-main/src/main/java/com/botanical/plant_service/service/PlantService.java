package com.botanical.plant_service.service;


import com.botanical.plant_service.domain.Observable;
import com.botanical.plant_service.domain.builder.PlantBuilder;
import com.botanical.plant_service.domain.dto.PlantDTO;
import com.botanical.plant_service.domain.entity.Plant;
import com.botanical.plant_service.domain.contracts.PlantRepository;
import com.botanical.plant_service.infrastructure.bridge.*;
import com.botanical.plant_service.service.observer.LoggingObserver;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;
@Service
public class PlantService extends Observable {

    private final PlantRepository plantRepository;

    private final ModelMapper mapper;

    @Autowired
    public PlantService(PlantRepository plantRepository, ModelMapper mapper, LoggingObserver loggingObserver) {
        this.plantRepository = plantRepository;
        this.mapper = mapper;
        this.addObserver(loggingObserver);
    }

    public PlantDTO getPlantById(int id) {
        Optional<Plant> plant = plantRepository.findById(id);
        if (plant.isPresent()) {
            return mapper.map(plant.get(), PlantDTO.class);
        } else {
            return null; // sau aruncă o exceptie, dupa preferință
        }
    }

    public List<PlantDTO> getAllPlants() {
        List<Plant> plants = plantRepository.findAll();
        return plants.stream()
                .map(plant -> mapper.map(plant, PlantDTO.class))
                .collect(Collectors.toList());
    }

    public PlantDTO createPlant(PlantDTO plantDTO) {
        Plant plant = new PlantBuilder()
                .setName(plantDTO.getName())
                .setType(plantDTO.getType())
                .setSpecies(plantDTO.getSpecies())
                .setCarnivore(plantDTO.getCarnivore())
                .build();

        System.out.println("Built Plant to be saved: " + plant);
        Plant saved = plantRepository.save(plant);
        System.out.println("Saved Plant (might be returning just id) : " + saved);
        notifyObservers();
        return mapper.map(saved, PlantDTO.class);
    }

    public PlantDTO updatePlant(int id, PlantDTO plantDTO) {
        Optional<Plant> existingOpt = plantRepository.findById(id);
        if (existingOpt.isEmpty()) {
            return null;
        }
        Plant existing = existingOpt.get();
        existing.setName(plantDTO.getName());
        existing.setType(plantDTO.getType());
        existing.setSpecies(plantDTO.getSpecies());
        existing.setCarnivore(plantDTO.getCarnivore());
        Plant saved = plantRepository.save(existing);
        notifyObservers();
        return mapper.map(saved, PlantDTO.class);
    }

    public boolean deletePlant(int id) {
        Optional<Plant> existingOpt = plantRepository.findById(id);
        if (existingOpt.isEmpty()) {
            return false;
        }
        plantRepository.deleteById(id);
        notifyObservers();
        return true;
    }

    public List<PlantDTO> getFilteredPlants(String search, String type, String species, Boolean carnivore, String sortBy, String order) {
        List<Plant> plants = plantRepository.findAll();

        Stream<Plant> stream = plants.stream();

        if (search != null && !search.isEmpty()) {
            String lowerSearch = search.toLowerCase();
            stream = stream.filter(p ->
                    p.getName().toLowerCase().contains(lowerSearch) ||
                            p.getSpecies().toLowerCase().contains(lowerSearch) ||
                            p.getType().toLowerCase().contains(lowerSearch)
            );
        }

        if (type != null && !type.isEmpty()) {
            stream = stream.filter(p -> p.getType().equalsIgnoreCase(type));
        }

        if (species != null && !species.isEmpty()) {
            stream = stream.filter(p -> p.getSpecies().equalsIgnoreCase(species));
        }

        if (carnivore != null) {
            stream = stream.filter(p -> p.getCarnivore() == carnivore);
        }

        List<Plant> filtered = stream.collect(Collectors.toList());

        Comparator<Plant> comparator;

        switch (sortBy.toLowerCase()) {
            case "name": comparator = Comparator.comparing(Plant::getName, Comparator.nullsFirst(String.CASE_INSENSITIVE_ORDER)); break;
            case "type": comparator = Comparator.comparing(Plant::getType, Comparator.nullsFirst(String.CASE_INSENSITIVE_ORDER)); break;
            case "species": comparator = Comparator.comparing(Plant::getSpecies, Comparator.nullsFirst(String.CASE_INSENSITIVE_ORDER)); break;
            case "carnivore": comparator = Comparator.comparing(Plant::getCarnivore); break;
            default: comparator = Comparator.comparing(Plant::getName, Comparator.nullsFirst(String.CASE_INSENSITIVE_ORDER));
        }

        if ("desc".equalsIgnoreCase(order)) {
            comparator = comparator.reversed();
        }

        filtered.sort(comparator);

        return filtered.stream()
                .map(p -> mapper.map(p, PlantDTO.class))
                .collect(Collectors.toList());
    }



    public void exportPlantsDTO(String format, List<PlantDTO> plants, String filePath) throws Exception {
        ExportFormat exportFormat = getExportFormat(format);
        PlantExporter exporter = new PlantExporter(exportFormat);
        exporter.exportToFile(plants, filePath);
    }

    public byte[] exportPlantsAsBytes(String format) throws Exception {
        ExportFormat exportFormat = getExportFormat(format);
        PlantExporter exporter = new PlantExporter(exportFormat);
        List<PlantDTO> plants = getAllPlants(); // you implement this method or reuse existing
        return exporter.exportToBytes(plants);
    }

    private ExportFormat getExportFormat(String format) {
        switch (format.toLowerCase()) {
            case "csv":
                return new CsvExportFormat();
            case "doc":
                return new DocExportFormat();
            case "json":
                return new JsonExportFormat();
            default:
                throw new IllegalArgumentException("Unsupported export format: " + format);
        }
    }

}
