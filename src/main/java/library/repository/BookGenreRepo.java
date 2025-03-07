package library.repository;

import library.models.BookGenre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookGenreRepo extends JpaRepository<BookGenre,Long> {

    List<BookGenre> findAllByBookId(Long bookId);

    List<BookGenre> findAllByGenreId(Long genreId);

    void deleteByBookIdAndGenreId(Long bookId, Long genreId);

    Optional<BookGenre> findByBookIdAndGenreId(Long bookId, Long genreId);
}
