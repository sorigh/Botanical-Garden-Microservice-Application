package com.botanical.specimen_service.infrastructure.exporter;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;
import com.botanical.specimen_service.domain.dto.SpecimenDTO;
import java.io.*;
import java.util.List;

public class CsvSpecimenExporter implements SpecimenExporter {

    @Override
    public ByteArrayInputStream export(List<?> specimens) {
        List<SpecimenDTO> specimenList = (List<SpecimenDTO>) specimens;

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        try (CSVPrinter printer = new CSVPrinter(new PrintWriter(out), CSVFormat.DEFAULT
                .withHeader("ID", "Location", "Image URL", "Plant ID"))) {

            for (SpecimenDTO s : specimenList) {
                printer.printRecord(s.getSpecimenId(), s.getLocation(), s.getImageUrl(), s.getPlantId());
            }

        } catch (IOException e) {
            throw new RuntimeException("CSV export failed", e);
        }
        return new ByteArrayInputStream(out.toByteArray());
    }

    @Override
    public String getContentType() {
        return "text/csv";
    }

    @Override
    public String getFileExtension() {
        return ".csv";
    }
}
