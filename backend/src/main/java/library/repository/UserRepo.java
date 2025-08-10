package library.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import library.models.User;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepo extends JpaRepository<User, Long> {

    @Query(value = "select coalesce(max(id),0)+1 from users ", nativeQuery = true)
    Long findNextId();

    Optional<User> findByEmail(String email);

    @Query(value = "SELECT * FROM users u WHERE CASE WHEN :status IS NOT NULL THEN u.is_active = :status ELSE TRUE END", nativeQuery = true)
    List<User> findAllByIsActive(Boolean status);

    @Query(value = "Select * from users u where u.email= ?1", nativeQuery = true)
    Optional<User> findByUsername(String userName);

    @Query(value = "select * from users u WHERE CASE WHEN :status IS NOT NULL THEN u.is_active = :status ELSE TRUE END", nativeQuery = true)
    Page<User> findAllPagewiseByIsActive(Pageable pageable, Boolean status);

    List<User> findAllByIsActiveAndUpdatedDateBefore(Boolean status, LocalDate updatedDate);
}