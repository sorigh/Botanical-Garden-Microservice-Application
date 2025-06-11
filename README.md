# 🌿 Botanical Garden Microservice Application

This project is a **microservice-based Botanical Garden Management System** built using **React** for the frontend and **Java Spring Boot** for the backend. It follows a **domain-driven design** architecture and demonstrates modular, scalable system design with role-based access, authentication, and CRUD operations.

---

## 🧩 Overview

The system is divided into several microservices, each running independently and registered through Eureka for service discovery. It features an API Gateway for routing requests and centralized access control.

### ⚙️ Technologies Used

- **Frontend**: React 
- **Backend**: Spring Boot microservices
  - `plant-service` 
  - `user-service`
  - `specimen-service`
- **API Gateway**: Spring Cloud Gateway
- **Service Discovery**: Eureka Server
- **Authentication & Authorization**: Spring Security & custom auth service
- **Internationalization (i18n)**: `react-i18next`

---

## ✅ Features

- 🔐 **User Authentication & Authorization**
  - Account creation and login using React (`auth.js`) and Spring Security
  - Role-based access control with four distinct roles

- 🌍 **Internationalization**
  - Multilingual interface using `i18n`

- 🪴 **Plant & Specimen Management**
  - Full CRUD operations on plants and specimens
  - Advanced features: filtering, searching, and statistics

- 👤 **Account Management**
  - Admin users can manage all user accounts (CRUD)

---

## 🧪 Local Setup

To run the application locally, start each component on the specified port:

| Component          | Port |
|--------------------|------|
| plant-service      | 8080 |
| user-service       | 8082 |
| specimen-service   | 8083 |
| API Gateway        | 8085 |
| Frontend (React)   | 3000 |
| Eureka Server      | 8761 |


---

## 📂 Final Notes

All final source code is included in this repository for reference and educational purposes. The project showcases a complete implementation of microservice principles in a real-world context.

---
