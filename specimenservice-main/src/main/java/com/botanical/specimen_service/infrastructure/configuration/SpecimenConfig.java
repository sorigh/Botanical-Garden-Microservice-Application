package com.botanical.specimen_service.infrastructure.configuration;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SpecimenConfig {

    @Bean
    public ModelMapper modelMapperBean() {
        return new ModelMapper();
    }

}