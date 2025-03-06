package library.utils;

import jakarta.annotation.PostConstruct;
import jakarta.mail.*;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import library.repository.EmailConfigRepo;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Optional;
import java.util.Properties;

@Service
@RequiredArgsConstructor
@Getter
@Setter
@Slf4j
public class EmailService {

    private final EmailConfigRepo emailConfigRepo;

    private String message = "Sent";
    private boolean status;
    @Value("${email-sender}")
    private String sender;
    @Value("${email-password}")
    private String password;
    @Value("${email-smtpHost}")
    private String smtpHost;
    @Value("${email-smtpPort}")
    private String smtpPort;
    @Value("${email-emailSignature}")
    private String emailSignature;

    @PostConstruct
    public void config() {
        Optional<EmailConfig> optionalEmailConfig = emailConfigRepo.findById(1L);
        if (optionalEmailConfig.isPresent())
            set(optionalEmailConfig.get());
        else
            use();
    }

    private void set(EmailConfig obj) {
        sender = obj.getSender();
        password = obj.getPassword();
        smtpHost = obj.getSmtpHost();
        smtpPort = obj.getSmtpPort();
        emailSignature = obj.getEmailSignature();
    }

    private void use() {
        EmailConfig emailConfig = EmailConfig.builder()
                .id(1L)
                .sender(sender)
                .password(password)
                .smtpHost(smtpHost)
                .smtpPort(smtpPort)
                .emailSignature(emailSignature)
                .build();
        emailConfigRepo.save(emailConfig);
    }

    public synchronized boolean sendMail(String receiver, String subject, String body) {

        Properties props = new Properties();
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.host", smtpHost);
        props.put("mail.smtp.port", smtpPort);

        try {
            Session session = Session.getInstance(props, new Authenticator() {
                protected PasswordAuthentication getPasswordAuthentication() {
                    return new PasswordAuthentication(sender, password);
                }
            });
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(sender, false));
            message.setRecipient(Message.RecipientType.TO, new InternetAddress(receiver));
            message.setSubject(subject);
            emailSignature = emailSignature.replace("\n", "<br>");
            message.setContent(body + "<br><br><br>" + emailSignature, "text/html;charset=UTF-8");
            message.setSentDate(new Date());
            Transport.send(message);
            status = true;
            log.info("Email sent successfully to {}", receiver);
        } catch (Exception e) {
            log.error("Error sending email {}", e.getMessage());
            status = false;
        }
        return status;
    }
}
