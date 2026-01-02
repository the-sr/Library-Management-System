package library.dto.Report;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class UserReportDto extends ReportDto{

    public UserReportDto(){
        super();
        query="select " +
                "    concat(u.first_name,case when u.middle_name is not null then ' ' || u.middle_name else '' end,' ' || u.last_name) as \"Full Name\", " +
                "    u.email as Email, " +
                "    u.role as Role, " +
                "    u.is_active as Status, " +
                "    u.created_date as Joined, " +
                "    u.borrowed_book_count as \"Number Of Books Borrowed\" " +
                " from users u where id= ";

        titles.add("LIBRARY KO NAME PVT. LTD.");
        titles.add("User Summary Report");
        titles.add("As on "+ LocalDate.now().format(DateTimeFormatter.ofPattern("MMMM yyyy")));
        titleDetails.put("Date",LocalDate.now());

        leftSideHeaderFields.put("Full Name","Full Name");
        leftSideHeaderFields.put("Email","Email");
        leftSideHeaderFields.put("Role","Role");
        leftSideHeaderFields.put("Status","Status");
        leftSideHeaderFields.put("Joined","Joined");
        leftSideHeaderFields.put("Number Of Books Borrowed","Number of Books Borrowed");

    }
}
