package com.botanical.specimen_service.service;


import com.botanical.specimen_service.domain.Observable;
import com.botanical.specimen_service.domain.builder.SpecimenBuilder;
import com.botanical.specimen_service.domain.contracts.SpecimenRepository;
import com.botanical.specimen_service.domain.dto.SpecimenDTO;
import com.botanical.specimen_service.domain.entity.Specimen;
import com.botanical.specimen_service.service.observer.LoggingObserver;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
@Service
public class SpecimenService extends Observable {

    private final SpecimenRepository specimenRepository;

    private final ModelMapper mapper;

    @Autowired
    public SpecimenService(SpecimenRepository specimenRepository, ModelMapper mapper, LoggingObserver loggingObserver) {
        this.specimenRepository = specimenRepository;
        this.mapper = mapper;
        this.addObserver(loggingObserver);
    }

    // returnează lista specimenelor pentru un plantId
    public SpecimenDTO findSpecimenByPlantId(int plantId) {
        Optional<Specimen> specimen = specimenRepository.findByPlantId(plantId);
        return specimen.map(s -> mapper.map(s, SpecimenDTO.class)).orElse(null);
    }


    public List<SpecimenDTO> getAllSpecimens() {
        List<Specimen> specimens = specimenRepository.findAll();
        return specimens.stream()
                .map(specimen -> mapper.map(specimen, SpecimenDTO.class))
                .collect(Collectors.toList());
    }

    public SpecimenDTO createSpecimen(SpecimenDTO specimenDTO) {
        Specimen specimen = new SpecimenBuilder()
                .location(specimenDTO.getLocation())
                .imageUrl(specimenDTO.getImageUrl())
                .plantId(specimenDTO.getPlantId())
                .build();
        Specimen saved = specimenRepository.save(specimen);
        return mapper.map(saved, SpecimenDTO.class);
    }

    public SpecimenDTO updateSpecimen(int id, SpecimenDTO specimenDTO) {
        return specimenRepository.findById(id)
                .map(existing -> {
                    Specimen updatedSpecimen = new SpecimenBuilder()
                            .specimenId(existing.getSpecimenId()) // keep the same ID
                            .location(specimenDTO.getLocation())
                            .imageUrl(specimenDTO.getImageUrl())
                            .plantId(specimenDTO.getPlantId())
                            .build();
                    System.out.println(updatedSpecimen);
                    Specimen updated = specimenRepository.save(updatedSpecimen);
                    return mapper.map(updated, SpecimenDTO.class);
                })
                .orElse(null);
    }

    public boolean deleteSpecimen(int id) {
        if (!specimenRepository.existsById(id)) {
            return false;
        }
        specimenRepository.deleteById(id);
        notifyObservers();
        return true;
    }

    public SpecimenDTO getSpecimenById(int id) {
        Optional<Specimen> plant = specimenRepository.findById(id);
        if (plant.isPresent()) {
            return mapper.map(plant.get(), SpecimenDTO.class);
        } else {
            return null; // or throw exception, your choice
        }
    }
}
