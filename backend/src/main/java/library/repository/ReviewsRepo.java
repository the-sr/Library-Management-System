package library.repository;

import library.models.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewsRepo extends JpaRepository<Review, Long> {

    @Query(value = " select avg(r.rating) " +
            " from reveiw r" +
            " where r.book_id = :bookId ", nativeQuery = true)
    Float getAverageRating(long bookId);

    List<Review> findAllByBookId(long bookId);

    List<Review> findAllByUserId(long userId);

    List<Review> findAllByUserIdAndBookId(long userId, long bookId);

}
