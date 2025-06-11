package com.botanical.plant_service.domain.dto;

public class PlantDTO {

    private int plantId;

    private String name;

    private String type;

    private String species;

    private Boolean carnivore;

    public int getPlantId() {
        return plantId;
    }

    public void setPlantId(int plantId) {
        this.plantId = plantId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getSpecies() {
        return species;
    }

    public void setSpecies(String species) {
        this.species = species;
    }

    public Boolean getCarnivore() {
        return carnivore;
    }

    public void setCarnivore(Boolean carnivore) {
        this.carnivore = carnivore;
    }

    @Override
    public String toString() {
        return "PlantDTO{" +
                "plantId=" + plantId +
                ", name='" + name + '\'' +
                ", type='" + type + '\'' +
                ", species='" + species + '\'' +
                ", carnivore=" + carnivore +
                '}';
    }
}
