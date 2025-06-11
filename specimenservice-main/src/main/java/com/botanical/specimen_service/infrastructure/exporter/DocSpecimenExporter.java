package com.botanical.specimen_service.infrastructure.exporter;

import com.botanical.specimen_service.domain.dto.SpecimenDTO;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.usermodel.XWPFTable;
import org.apache.poi.xwpf.usermodel.XWPFTableRow;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.util.List;

public class DocSpecimenExporter implements SpecimenExporter {
    @Override
    public ByteArrayInputStream export(List<?> specimens) throws Exception {
        List<SpecimenDTO> specimenList = (List<SpecimenDTO>) specimens;

        try (XWPFDocument document = new XWPFDocument();
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            XWPFTable table = document.createTable();

            XWPFTableRow header = table.getRow(0);
            header.getCell(0).setText("ID");
            header.addNewTableCell().setText("Location");
            header.addNewTableCell().setText("Image URL");
            header.addNewTableCell().setText("Plant ID");

            for (SpecimenDTO s : specimenList) {
                XWPFTableRow row = table.createRow();
                row.getCell(0).setText(String.valueOf(s.getSpecimenId()));
                row.getCell(1).setText(s.getLocation());
                row.getCell(2).setText(s.getImageUrl());
                row.getCell(3).setText(String.valueOf(s.getPlantId()));
            }

            document.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        }
    }

    @Override
    public String getFileExtension() {
        return ".docx";
    }

    @Override
    public String getContentType() {
        return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    }
}
