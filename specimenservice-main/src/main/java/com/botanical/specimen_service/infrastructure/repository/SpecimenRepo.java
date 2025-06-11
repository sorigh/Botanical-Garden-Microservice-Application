package com.botanical.specimen_service.infrastructure.repository;


import com.botanical.specimen_service.domain.entity.Specimen;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SpecimenRepo extends JpaRepository<Specimen, Integer> {


    @Query(
            nativeQuery = true,
            value = "SELECT specimenId, location, imageUrl FROM specimen WHERE plantId = :plantId"
    )
    Optional<Specimen> findSpecimenByPlantId(@Param("plantId") int plantId);
}
