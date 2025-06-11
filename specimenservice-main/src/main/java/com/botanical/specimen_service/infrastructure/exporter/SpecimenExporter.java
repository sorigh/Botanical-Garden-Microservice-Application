package com.botanical.specimen_service.infrastructure.exporter;

import java.io.ByteArrayInputStream;
import java.util.List;

public interface SpecimenExporter {
    ByteArrayInputStream export(List<?> specimens) throws Exception;
    String getContentType();
    String getFileExtension();
}
