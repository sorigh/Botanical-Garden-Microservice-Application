package com.botanical.specimen_service.domain.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "specimen")
public class Specimen {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "specimenId")
    private int specimenId;

    @Column(name = "location")
    private String location;

    @Column(name = "imageUrl")
    private String imageUrl;

    @Column(name = "plantId")
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

    @Override
    public String toString() {
        return "Specimen{" +
                "specimenId=" + specimenId +
                ", location='" + location + '\'' +
                ", imageUrl='" + imageUrl + '\'' +
                ", plantId=" + plantId +
                '}';
    }
}