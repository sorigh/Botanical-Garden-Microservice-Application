package com.botanical.plant_service.domain.builder;

import com.botanical.plant_service.domain.entity.Plant;

public class PlantBuilder {
    private String name;
    private String type;
    private String species;
    private boolean carnivore;

    public PlantBuilder setName(String name) {
        this.name = name;
        return this;
    }

    public PlantBuilder setType(String type) {
        this.type = type;
        return this;
    }

    public PlantBuilder setSpecies(String species) {
        this.species = species;
        return this;
    }

    public PlantBuilder setCarnivore(boolean carnivore) {
        this.carnivore = carnivore;
        return this;
    }

    public Plant build() {
        return new Plant(name, type, species, carnivore);
    }
}
