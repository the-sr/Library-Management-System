package library.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import library.models.Address;

import java.util.List;
import java.util.Optional;

@Repository
public interface AddressRepo extends JpaRepository<Address, Long> {

    @Query(value = "select coalesce(max(id),0)+1 from address", nativeQuery = true)
    Long findNextId();

    Optional<Address> findById(long id);

    List<Address> findByUserId(long userId);
}