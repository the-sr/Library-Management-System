package library.services;

import library.enums.ReportFormat;

public interface ReportService {

    void generateLibraryReport(ReportFormat reportFormat);

    void generateUserReport(ReportFormat reportFormat,Long userId);

}
