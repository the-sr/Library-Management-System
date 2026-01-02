package library.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import library.models.UserBook;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserBookRepo extends JpaRepository<UserBook, Long> {

    @Query(value = "Select coalesce(max(id),0)+1 from user_book ", nativeQuery = true)
    long findNextId();

    Optional<UserBook> findByUserIdAndBookId(Long userId, Long bookId);

    @Query(value = " select ub.* " +
            " from user_book ub " +
            " where case when :userId is not null then ub.user_id = :userId else true end " +
            "  and case when :requestType is not null then ub.request_type = :requestType else true end " +
            "  and case when :isActive is not null then ub.is_active = :isActive else true end ",nativeQuery = true)
    List<UserBook> findAll(Long userId, String requestType, Boolean isActive);

    List<UserBook> findAllByExpectedReturnDateBefore(LocalDate expectedReturnDate);

}