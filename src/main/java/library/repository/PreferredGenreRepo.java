package library.repository;

import library.models.PreferredGenre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface PreferredGenreRepo extends JpaRepository<PreferredGenre, Long> {

    @Query(value=" select pg.user_id " +
            " from preferred_genre pg " +
            " where pg.genre_id = :genreId ",nativeQuery = true)
    Set<Long> findAllUserIdsByGenreId(Long genreId);

    List<PreferredGenre> findAllByUserId(Long userId);

    void deleteAllByUserIdAndGenreId(Long userId, Long genreId);

    Optional<PreferredGenre> findByUserIdAndGenreId(Long userId, Long genreId);
}
