package com.botanical.plant_service.infrastructure.repository;

import com.botanical.plant_service.domain.entity.Plant;
import com.botanical.plant_service.domain.contracts.PlantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class PlantRepositoryAdapter implements PlantRepository {

    @Autowired
    private final PlantRepo plantRepo;

    public PlantRepositoryAdapter(PlantRepo plantRepo) {
        this.plantRepo = plantRepo;
    }

    @Override
    public Plant save(Plant plant) {
        return plantRepo.save(plant);
    }

    @Override
    public Optional<Plant> findById(Integer id) {
        return plantRepo.findById(id);
    }

    @Override
    public List<Plant> findAll() {
        return plantRepo.findAll();
    }

    @Override
    public void deleteById(Integer id) {
        plantRepo.deleteById(id);
    }
}
