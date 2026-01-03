package library.controller;

import library.services.FileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/file")
@RequiredArgsConstructor
public class FileController {

    private final FileService fileService;

    @GetMapping
    public ResponseEntity<?> getFile(@RequestParam String fileName) {
        return ResponseEntity.ok().body(fileService.getFile(fileName));
    }

}
