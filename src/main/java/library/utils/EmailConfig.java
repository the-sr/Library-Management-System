package library.utils;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class EmailConfig {
    @Id
    private Long id;

    @Column(name = "sender")
    private String sender;

    @Column(name = "smtp_host")
    private String smtpHost;

    @Column(name = "smtp_port")
    private String smtpPort;

    @Column(name = "email_signature")
    private String emailSignature;

    @Column(name = "password")
    private String password;

}
