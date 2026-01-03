package library.services.impl;

import library.dto.ReviewDto;
import library.exception.CustomException;
import library.models.Book;
import library.models.Review;
import library.repository.BookRepo;
import library.repository.ReviewsRepo;
import library.services.ReviewService;
import library.services.mappers.ReviewMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor

public class ReviewServiceImpl implements ReviewService {

    private final ReviewMapper reviewMapper;
    private final ReviewsRepo reviewsRepo;
    private final BookRepo bookRepo;

    @Override
    public ReviewDto addReview(ReviewDto req) {
        Review review = reviewMapper.dtoToEntity(req);
        review.setCreatedDate(LocalDateTime.now());
        review =reviewsRepo.save(review);
        Float averageRatings= reviewsRepo.getAverageRating(req.getBookId());
        Book book=bookRepo.findById(req.getBookId()).orElseThrow(()->new CustomException("Book not found", HttpStatus.NOT_FOUND));
        book.setAverageRating(averageRatings);
        bookRepo.save(book);
        return reviewMapper.entityToDto(review);
    }

    @Override
    public ReviewDto addReply(ReviewDto req) {
        return null;
    }

    @Override
    public List<ReviewDto> getReviewsByBookId(long bookId) {
        List<Review> reviewList =reviewsRepo.findAllByBookId(bookId);
        List<ReviewDto> res=new ArrayList<>();
        reviewList.forEach(reviews -> res.add(reviewMapper.entityToDto(reviews)));
        return res;
//        return reviewsList.stream().map(reviewsMapper::entityToDto).collect(Collectors.toList());
    }

    @Override
    public List<ReviewDto> getAllReviewsByUserId(long userId) {
        List<Review> reviewList =reviewsRepo.findAllByUserId(userId);
        return reviewList.stream().map(reviewMapper::entityToDto).collect(Collectors.toList());
    }

    @Override
    public ReviewDto updateReview(ReviewDto req) {
        Review review =reviewsRepo.findById(req.getId()).orElseThrow(()->new CustomException("Review not found", HttpStatus.NOT_FOUND));
        review.setComment(req.getComment());
        review.setRating(req.getRating());
        review =reviewsRepo.save(review);
        Float averageRatings= reviewsRepo.getAverageRating(req.getBookId());
        Book book=bookRepo.findById(req.getBookId()).orElseThrow(()->new CustomException("Book not found", HttpStatus.NOT_FOUND));
        book.setAverageRating(averageRatings);
        bookRepo.save(book);
        return reviewMapper.entityToDto(review);
    }

    @Override
    public String deleteReview(long reviewId) {
        reviewsRepo.deleteById(reviewId);
        return "Review deleted successfully";
    }
}
