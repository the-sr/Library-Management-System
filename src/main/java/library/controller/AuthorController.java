package library.controller;

import library.dto.AuthorDto;
import library.services.AuthorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AuthorController {

    private final AuthorService authorService;

    @PreAuthorize("hasAuthority('LIBRARIAN')")
    @PostMapping("/author")
    public ResponseEntity<?> createAuthor(@RequestBody AuthorDto req) {
        return ResponseEntity.ok(authorService.add(req));
    }

    @GetMapping("/authors")
    public ResponseEntity<?> getAllAuthors() {
        return ResponseEntity.ok(authorService.getAllAuthors());
    }

    @GetMapping("/author/{id}")
    public ResponseEntity<?> getAuthorById(@PathVariable long id) {
        return ResponseEntity.ok(authorService.getById(id));
    }
}
