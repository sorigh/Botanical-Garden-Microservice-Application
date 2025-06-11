package com.botanical.specimen_service.infrastructure.exporter;

import com.botanical.specimen_service.domain.dto.SpecimenDTO;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.util.List;

public class JsonSpecimenExporter implements SpecimenExporter {
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public ByteArrayInputStream export(List<?> specimens) throws Exception {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        objectMapper.writeValue(out, specimens);
        return new ByteArrayInputStream(out.toByteArray());
    }

    @Override
    public String getFileExtension() {
        return ".json";
    }

    @Override
    public String getContentType() {
        return "application/json";
    }
}
