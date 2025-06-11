package com.botanical.specimen_service.infrastructure.repository;

import com.botanical.specimen_service.domain.entity.Specimen;
import com.botanical.specimen_service.domain.contracts.SpecimenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class SpecimenRepositoryAdapter implements SpecimenRepository {

    private final SpecimenRepo specimenRepo;

    @Autowired
    public SpecimenRepositoryAdapter(SpecimenRepo specimenRepo) {
        this.specimenRepo = specimenRepo;
    }

    @Override
    public Optional<Specimen> findByPlantId(int plantId) {
        return specimenRepo.findSpecimenByPlantId(plantId);
    }

    @Override
    public List<Specimen> findAll() {
        return specimenRepo.findAll();
    }

    @Override
    public Specimen save(Specimen specimen) {
        return specimenRepo.save(specimen);
    }

    @Override
    public Optional<Specimen> findById(int id) {
        return specimenRepo.findById(id);
    }

    @Override
    public void deleteById(int id) {
        specimenRepo.deleteById(id);
    }

    @Override
    public boolean existsById(int id) {
        return specimenRepo.existsById(id);
    }
}
