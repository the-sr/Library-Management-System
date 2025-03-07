package library.controller;

import jakarta.validation.Valid;
import library.dto.AuthorDto;
import library.dto.BookDto;
import library.dto.GenreDto;
import library.services.BookService;
import library.utils.AppConstants;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class BookController {

    private final BookService bookService;

    @PreAuthorize("hasAuthority('LIBRARIAN')")
    @PostMapping("/add-book")
    public ResponseEntity<?> addBook(@RequestBody BookDto req) {
        return ResponseEntity.ok().body(bookService.add(req));
    }

    @GetMapping("/book/{id}")
    public ResponseEntity<?> getBookById(@PathVariable Long id) {
        return ResponseEntity.ok().body(bookService.findById(id));
    }

    @GetMapping("/books-by-title")
    public ResponseEntity<?> getBookByTitle(@RequestParam String title) {
        return ResponseEntity.ok().body(bookService.findByTitle(title));
    }

    @GetMapping("/books-by-author")
    public ResponseEntity<?> getBookByAuthor(@RequestParam String author) {
        return ResponseEntity.ok().body(bookService.findByAuthor(author));
    }

    @GetMapping("/books-by-genre")
    public ResponseEntity<?> getBookByGenre(@RequestParam String genre) {
        return ResponseEntity.ok().body(bookService.findByGenre(genre));
    }

    @GetMapping("/books")
    public ResponseEntity<?> getAllBooks() {
        return ResponseEntity.ok().body(bookService.getAllBooks());
    }

    @GetMapping("/page-wise-books")
    public ResponseEntity<?> getBooksPageWise(
            @RequestParam("pageNumber") Integer pageNumber,
            @RequestParam(value = "pageSize", defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize,
            @RequestParam(value = "sortBy", defaultValue = AppConstants.SORT_BY, required = false) String sortBy,
            @RequestParam(value = "sortDirection", defaultValue = AppConstants.SORT_DIRECTION, required = false) String sortDirection) {
        return ResponseEntity.ok().body(bookService.getAllBooks(pageNumber, pageSize, sortBy, sortDirection));
    }

    @PreAuthorize("hasAuthority('LIBRARIAN')")
    @PutMapping("/book")
    public ResponseEntity<?> updateBook(@Valid @RequestBody BookDto req) {
        return ResponseEntity.ok().body(bookService.updateById(req));
    }

    @PreAuthorize("hasAuthority('LIBRARIAN')")
    @DeleteMapping("book/{id}")
    public ResponseEntity<?> deleteBook(@PathVariable("id") long id) {
        return ResponseEntity.ok().body(bookService.removeById(id));
    }

    @PreAuthorize("hasAuthority('LIBRARIAN')")
    @PutMapping("/book/add-author")
    public ResponseEntity<?> addAuthor(@RequestParam Long bookId, @RequestBody List<AuthorDto> req) {
        return ResponseEntity.ok().body(bookService.addBookAuthor(bookId, req));
    }

    @PreAuthorize("hasAuthority('LIBRARIAN')")
    @PutMapping("/book/remove-author")
    public ResponseEntity<?> removeAuthor(@RequestParam Long bookId, @RequestParam Long authorId) {
        return ResponseEntity.ok().body(bookService.removeBookAuthor(bookId, authorId));
    }

    @PreAuthorize("hasAuthority('LIBRARIAN')")
    @PutMapping("/book/add-genre")
    public ResponseEntity<?> addGenre(@RequestParam Long bookId, @RequestBody List<GenreDto> req) {
        return ResponseEntity.ok().body(bookService.addBookGenre(bookId, req));
    }

    @PreAuthorize("hasAuthority('LIBRARIAN')")
    @PutMapping("/book/remove-genre")
    public ResponseEntity<?> removeGenre(@RequestParam Long bookId, @RequestParam Long genreId) {
        return ResponseEntity.ok().body(bookService.removeBookGenre(bookId, genreId));
    }

}
