package com.botanical.specimen_service.domain.dto;


public class SpecimenDTO {
    private int specimenId;


    private String location;

    private String imageUrl;

    private int plantId;

    public int getSpecimenId() {
        return specimenId;
    }

    public void setSpecimenId(int specimenId) {
        this.specimenId = specimenId;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public int getPlantId() {
        return plantId;
    }

    public void setPlantId(int plantId) {
        this.plantId = plantId;
    }
}