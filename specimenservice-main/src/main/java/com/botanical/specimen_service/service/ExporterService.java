package com.botanical.specimen_service.service;

import com.botanical.specimen_service.infrastructure.exporter.CsvSpecimenExporter;
import com.botanical.specimen_service.infrastructure.exporter.DocSpecimenExporter;
import com.botanical.specimen_service.infrastructure.exporter.JsonSpecimenExporter;
import com.botanical.specimen_service.infrastructure.exporter.SpecimenExporter;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class ExporterService {

    private final Map<String, SpecimenExporter> exporters = new HashMap<>();

    public ExporterService() {
        registerExporter("csv", new CsvSpecimenExporter());
        registerExporter("doc", new DocSpecimenExporter());
        registerExporter("json", new JsonSpecimenExporter());
    }

    public void registerExporter(String format, SpecimenExporter exporter) {
        exporters.put(format.toLowerCase(), exporter);
    }

    public SpecimenExporter getExporter(String format) {
        return exporters.get(format.toLowerCase());
    }

    public boolean supports(String format) {
        return exporters.containsKey(format.toLowerCase());
    }
}
