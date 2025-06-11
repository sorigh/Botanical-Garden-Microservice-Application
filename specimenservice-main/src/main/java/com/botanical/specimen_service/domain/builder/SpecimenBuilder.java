package com.botanical.specimen_service.domain.builder;

import com.botanical.specimen_service.domain.entity.Specimen;

public class SpecimenBuilder {
    private int specimenId;
    private String location;
    private String imageUrl;
    private int plantId;

    public SpecimenBuilder() {
    }

    public SpecimenBuilder specimenId(int specimenId) {
        this.specimenId = specimenId;
        return this;
    }

    public SpecimenBuilder location(String location) {
        this.location = location;
        return this;
    }

    public SpecimenBuilder imageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
        return this;
    }

    public SpecimenBuilder plantId(int plantId) {
        this.plantId = plantId;
        return this;
    }

    public Specimen build() {
        Specimen specimen = new Specimen();
        specimen.setSpecimenId(specimenId);
        specimen.setLocation(location);
        specimen.setImageUrl(imageUrl);
        specimen.setPlantId(plantId);
        return specimen;
    }
}
