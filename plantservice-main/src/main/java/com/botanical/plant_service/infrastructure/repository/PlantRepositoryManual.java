package com.botanical.plant_service.infrastructure.repository;

import com.botanical.plant_service.domain.builder.PlantBuilder;
import com.botanical.plant_service.domain.entity.Plant;
import com.botanical.plant_service.domain.contracts.PlantRepository;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

public class PlantRepositoryManual implements PlantRepository {

    @Override
    public Optional<Plant> findById(Integer id) {
        try (Connection conn = DatabaseSingleton.getInstance().getConnection();
             PreparedStatement stmt = conn.prepareStatement("SELECT * FROM plants WHERE plant_id = ?")) {

            stmt.setInt(1, id);
            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
                Plant plant = new PlantBuilder()
                        .setName(rs.getString("name"))
                        .setType(rs.getString("type"))
                        .setSpecies(rs.getString("species"))
                        .setCarnivore(rs.getBoolean("carnivore"))
                        .build();

                plant.setPlantId(rs.getInt("plant_id"));

                return Optional.of(plant);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return Optional.empty();
    }

    @Override
    public List<Plant> findAll() {
        List<Plant> plants = new ArrayList<>();
        try (Connection conn = DatabaseSingleton.getInstance().getConnection();
             PreparedStatement stmt = conn.prepareStatement("SELECT * FROM plants");
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                Plant plant = new PlantBuilder()
                        .setName(rs.getString("name"))
                        .setType(rs.getString("type"))
                        .setSpecies(rs.getString("species"))
                        .setCarnivore(rs.getBoolean("carnivore"))
                        .build();

                plant.setPlantId(rs.getInt("plant_id"));
                plants.add(plant);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return plants;
    }

    @Override
    public void deleteById(Integer id) {
        try (Connection conn = DatabaseSingleton.getInstance().getConnection();
             PreparedStatement stmt = conn.prepareStatement("DELETE FROM plants WHERE plant_id = ?")) {

            stmt.setInt(1, id);
            stmt.executeUpdate();

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    @Override
    public Plant save(Plant plant) {
        // simplificat: doar insert, fără update
        try (Connection conn = DatabaseSingleton.getInstance().getConnection();
             PreparedStatement stmt = conn.prepareStatement(
                     "INSERT INTO plants (name, type, species, carnivore) VALUES (?, ?, ?, ?)",
                     Statement.RETURN_GENERATED_KEYS)) {

            stmt.setString(1, plant.getName());
            stmt.setString(2, plant.getType());
            stmt.setString(3, plant.getSpecies());
            stmt.setBoolean(4, plant.getCarnivore());

            int affectedRows = stmt.executeUpdate();

            if (affectedRows == 0) {
                throw new SQLException("Creating plant failed, no rows affected.");
            }

            try (ResultSet generatedKeys = stmt.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    plant.setPlantId(generatedKeys.getInt(1));
                } else {
                    throw new SQLException("Creating plant failed, no ID obtained.");
                }
            }

            return plant;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }

}
