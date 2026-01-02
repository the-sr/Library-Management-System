package library.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import library.models.Book;

import java.util.List;

@Repository
public interface BookRepo extends JpaRepository<Book, Long> {

    @Query(value = "Select coalesce(max(id),0)+1 from book ", nativeQuery = true)
    long findNextId();

    @Query(value = " SELECT b.* " +
            " FROM book b " +
            " WHERE LOWER(b.title) LIKE LOWER(CONCAT('%', :title, '%')) ", nativeQuery = true)
    List<Book> findByTitle(String title);

}