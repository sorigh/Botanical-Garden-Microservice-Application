package com.botanical.specimen_service.domain.contracts;

import com.botanical.specimen_service.domain.entity.Specimen;

import java.util.List;
import java.util.Optional;

public interface SpecimenRepository {
    Optional<Specimen> findByPlantId(int plantId);

    List<Specimen> findAll();

    Specimen save(Specimen specimen);

    Optional<Specimen> findById(int id);

    void deleteById(int id);

    boolean existsById(int id);
}
