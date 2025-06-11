package com.botanical.specimen_service.infrastructure.repository;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DatabaseSingleton {

    private static DatabaseSingleton instance;

    private final String url = "jdbc:mysql://localhost:3306/specimenservicedb";
    private final String username = "microservice_user";
    private final String password = "microservice_user_PASS176";

    private DatabaseSingleton() throws SQLException {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException ex) {
            throw new SQLException("MySQL Driver not found.", ex);
        }
    }

    public static DatabaseSingleton getInstance() throws SQLException {
        if (instance == null) {
            synchronized (DatabaseSingleton.class) {
                if (instance == null) {
                    instance = new DatabaseSingleton();
                }
            }
        }
        return instance;
    }

    public Connection getConnection() throws SQLException {
        return DriverManager.getConnection(url, username, password);
    }
}
