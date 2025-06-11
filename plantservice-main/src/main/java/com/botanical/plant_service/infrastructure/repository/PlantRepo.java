package com.botanical.plant_service.infrastructure.repository;


import com.botanical.plant_service.domain.entity.Plant;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PlantRepo extends JpaRepository<Plant, Integer> {

}