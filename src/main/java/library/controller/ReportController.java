package library.controller;

import library.enums.ReportFormat;
import library.services.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/report")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("library")
    public ResponseEntity<?> getLibraryReport(@RequestParam ReportFormat reportFormat) {
        reportService.generateLibraryReport(reportFormat);
        return ResponseEntity.ok().build();
    }

    @GetMapping("user")
    public ResponseEntity<?> getUserReport(@RequestParam long userId, @RequestParam ReportFormat reportFormat) {
        reportService.generateUserReport(reportFormat,userId);
        return ResponseEntity.ok().build();
    }
//
//    @GetMapping("books")
//    public ResponseEntity<?> getBooksReport(@RequestParam ReportFormat reportFormat) {
//        reportService.generateBookReport(reportFormat);
//        return ResponseEntity.ok().build();
//    }
//
//    @GetMapping("user-book")
//    public ResponseEntity<?> getUserBookReport(@RequestParam ReportFormat reportFormat) {
//        reportService.generateUserBookReport(reportFormat);
//        return ResponseEntity.ok().build();
//    }

}
