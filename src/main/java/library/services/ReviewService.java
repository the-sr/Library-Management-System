package library.services;

import library.dto.ReviewDto;

import java.util.List;

public interface ReviewService {

    ReviewDto addReview(ReviewDto req);

    ReviewDto addReply(ReviewDto req);

    List<ReviewDto> getReviewsByBookId(long bookId);

    List<ReviewDto> getAllReviewsByUserId(long userId);

    ReviewDto updateReview(ReviewDto req);

    String deleteReview(long reviewId);

}
