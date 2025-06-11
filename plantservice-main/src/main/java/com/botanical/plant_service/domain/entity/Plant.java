package com.botanical.plant_service.domain.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "plant")
public class Plant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "plantId")
    private int plantId;

    @Column(name = "name")
    private String name;

    @Column(name = "type")
    private String type;

    @Column(name = "species")
    private String species;

    @Column(name = "carnivore")
    private Boolean carnivore;

    public Plant(String name, String type, String species, boolean carnivore) {
        this.name = name;
        this.type = type;
        this.species = species;
        this.carnivore = carnivore;
    }

    protected Plant() {
    }
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
        return "Plant{" +
                "plantId=" + plantId +
                ", name='" + name + '\'' +
                ", type='" + type + '\'' +
                ", species='" + species + '\'' +
                ", carnivore=" + carnivore +
                '}';
    }
}
