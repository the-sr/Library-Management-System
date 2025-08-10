package library.controller;

import io.swagger.v3.oas.annotations.Operation;
import library.services.UserBookService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserBookController {

    private final UserBookService userBookService;

    @PreAuthorize("hasAuthority('MEMBER')")
    @Operation(summary = "Send book borrow request")
    @PostMapping("/borrow-request")
    public ResponseEntity<?> borrowRequest(@RequestParam Long bookId){
        return ResponseEntity.ok().body(userBookService.borrowRequest(bookId));
    }

    @PreAuthorize("hasAuthority('MEMBER')")
    @Operation(summary = "Send book borrow request")
    @DeleteMapping("/cancel-borrow-request")
    public ResponseEntity<?> cancelBorrowRequest(@RequestParam Long bookId){
        return ResponseEntity.ok().body(userBookService.cancelBorrowRequest(bookId));
    }

    @PreAuthorize("hasAuthority('MEMBER')")
    @Operation(summary = "Send book borrow request")
    @PostMapping("/return-request")
    public ResponseEntity<?> returnRequest(@RequestParam Long userBookId){
        return ResponseEntity.ok().body(userBookService.returnRequest(userBookId));
    }

    @PreAuthorize("hasAuthority('MEMBER')")
    @Operation(summary = "Send book return request")
    @DeleteMapping("/cancel-return-request")
    public ResponseEntity<?> cancelReturnRequest(@RequestParam Long userBookId){
        return ResponseEntity.ok().body(userBookService.cancelReturnRequest(userBookId));
    }

    @PreAuthorize("hasAnyAuthority('LIBRARIAN','MEMBER')")
    @Operation(summary = "Get user book details")
    @GetMapping("/user-book/{userBookId}")
    public ResponseEntity<?> getUserBookById(@PathVariable Long userBookId){
        return ResponseEntity.ok(userBookService.getById(userBookId));
    }

    @PreAuthorize("hasAnyAuthority('LIBRARIAN','MEMBER')")
    @Operation(summary = "Get user books by user id or request type or active status")
    @GetMapping("/user-books")
    public ResponseEntity<?> getUserBooks(
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) String requestType,
            @RequestParam(required = false) Boolean isActive){
        return ResponseEntity.ok(userBookService.getAll(userId,requestType,isActive));
    }

    @PreAuthorize("hasAuthority('LIBRARIAN')")
    @PutMapping("/user-book/handle-borrow-request")
    public ResponseEntity<?> handleBorrowRequest(@RequestParam Long userBookId){
        return ResponseEntity.ok().body(userBookService.handelBorrowRequest(userBookId));
    }

    @PreAuthorize("hasAuthority('LIBRARIAN')")
    @PutMapping("/user-book/handle-return-request")
    public ResponseEntity<?> handleReturnRequest(@RequestParam Long userBookId){
        return ResponseEntity.ok().body(userBookService.handelReturnRequest(userBookId));
    }
}
