package library.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import library.models.Genre;

import java.util.List;
import java.util.Optional;

@Repository
public interface GenreRepo extends JpaRepository<Genre, Long> {

    @Query(value = "Select coalesce(max(id),0)+1 from genre", nativeQuery = true)
    Long findNextId();

    @Query(value = "select * from genre g where lower(g.name)= lower(:name)", nativeQuery = true)
    Optional<Genre> findByName(String name);

    @Query(value = " select g.* " +
            " from genre g " +
            " where lower(g.name) like lower(concat('%',:genreName,'%')) ", nativeQuery = true)
    List<Genre> findAllByGenreName(String genreName);

}