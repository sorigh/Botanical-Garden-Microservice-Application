package com.botanical.plant_service.infrastructure.configuration;

import com.botanical.plant_service.service.PlantService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class PlantConfig {
    @Value("${specimenservice.base.url}")
    private String specimenBaseUrl;
    @Bean
    public ModelMapper modelMapperBean() {
        return new ModelMapper();
    }
    @Bean
    public WebClient webClient() {
        return WebClient.builder().baseUrl(specimenBaseUrl).build();
    }


}