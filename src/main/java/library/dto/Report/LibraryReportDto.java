package library.dto.Report;

import java.time.LocalDate;

public class LibraryReportDto extends ReportDto {

    public LibraryReportDto() {
        super();
        titles.add("Library Report");

        rightSideHeaderFields.put("Date", LocalDate.now());

        fields.put("Admin","");
        fields.put("Librarian","");
        fields.put("Members",0.0);
        fields.put("Books",0.0);

        rightSideSummaryFields.put("Signature",null);
    }
}
