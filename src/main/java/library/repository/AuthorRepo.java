package library.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import library.models.Author;

import java.util.List;
import java.util.Optional;

public interface AuthorRepo extends JpaRepository<Author, Long> {

    @Query(value = "Select coalesce(max(id),0)+1 from author ", nativeQuery = true)
    Long findNextId();

    @Query(value = " select * " +
            " from author a " +
            " where lower(concat(a.first_name, ' ', a.last_name)) = lower(:name) ", nativeQuery = true)
    Optional<Author> findByName(String name);

    @Query(value = " select a.* " +
            " from author a " +
            " where lower(concat(a.first_name, ' ', a.last_name)) like lower(concat('%', :authorName, '%')) ", nativeQuery = true)
    List<Author> findByAuthorName(String authorName);
}