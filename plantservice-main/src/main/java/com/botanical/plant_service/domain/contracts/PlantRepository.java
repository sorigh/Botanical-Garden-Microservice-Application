package com.botanical.plant_service.domain.contracts;

import com.botanical.plant_service.domain.entity.Plant;

import java.util.List;
import java.util.Optional;

public interface PlantRepository {
    Plant save(Plant plant);
    Optional<Plant> findById(Integer id);
    List<Plant> findAll();
    void deleteById(Integer id);
}
