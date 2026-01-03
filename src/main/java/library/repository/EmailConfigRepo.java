package library.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import library.utils.EmailConfig;

public interface EmailConfigRepo extends JpaRepository<EmailConfig, Long> {
}