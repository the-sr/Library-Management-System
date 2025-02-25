package library.controller;

import library.dto.ReviewDto;
import library.services.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping("/add-review")
    public ResponseEntity<?> addReview(@RequestBody ReviewDto req){
        return ResponseEntity.ok(reviewService.addReview(req));
    }

    @GetMapping("/reviews-by-user")
    public ResponseEntity<?> getReviewsByUserId(@RequestParam long userId){
        return ResponseEntity.ok(reviewService.getAllReviewsByUserId(userId));
    }

    @GetMapping("/review-by-book")
    public ResponseEntity<?> getReviewsByBookId(@RequestParam long bookId){
        return ResponseEntity.ok(reviewService.getReviewsByBookId(bookId));
    }

    @PutMapping("/review")
    public ResponseEntity<?> updateReview(@RequestBody ReviewDto req){
        return ResponseEntity.ok(reviewService.updateReview(req));
    }

    @DeleteMapping("/review/{id}")
    public ResponseEntity<?> deleteReview(@PathVariable long id){
        return ResponseEntity.ok(reviewService.deleteReview(id));
    }


}
