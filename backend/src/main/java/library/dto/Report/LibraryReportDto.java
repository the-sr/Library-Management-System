package library.dto.Report;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class LibraryReportDto extends ReportDto {

    public LibraryReportDto() {
        super();

        query="Select * from users";

        titles.add("LIBRARY KO NAME PVT. LTD.");
        titles.add("Summary Report");
        subtitles.add("As on "+ LocalDate.now().format(DateTimeFormatter.ofPattern("MMMM yyyy")));
        titleDetails.put("Date",LocalDate.now());

        rightSideHeaderFields.put("Date", LocalDate.now());

        fields.put("Admin","");
        fields.put("Librarian","");
        fields.put("Members",0.0);
        fields.put("Books",0.0);

        rightSideSummaryFields.put("Signature",null);
    }
}
