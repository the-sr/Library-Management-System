package library.utils;

import library.models.Book;
import library.models.User;
import library.models.UserBook;
import library.repository.UserBookRepo;
import library.repository.UserRepo;
import library.services.impl.UserServiceImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ScheduledService {

    private final UserBookRepo userBookRepo;
    private final EmailService emailService;
    private final SimpMessagingTemplate simpMessagingTemplate;
    private final UserRepo userRepo;

    @Scheduled(cron = "0 5 * * * *")    //runs every 5 minutes
    private void clearOTPMap(){
        UserServiceImpl.removeExpiredOtp();
        log.info("OTP map cleared");
    }

    @Scheduled(cron = "0 0 0 * * *")    //runs at 12 am everyday
    private void clearTokenMap(){
        UserServiceImpl.clearTokenMap();
        log.info("Token map cleared");
    }

    @Scheduled(cron = "0 0 0 * * *")    //runs at 12 am everyday
    private void deleteInActiveAccounts(){
        List<User> userList=userRepo.findAllByIsActiveAndUpdatedDateBefore(false,LocalDate.now().minusMonths(1));
        if(userList!=null && !userList.isEmpty())
            userRepo.deleteAll(userList);
        log.info("Inactive accounts deleted");
    }

    @Scheduled(cron = "0 0 0 * * *")    //runs at 12 am everyday
    private void notifyOverdueBooks() {
        List<UserBook> userBookList = userBookRepo.findAllByExpectedReturnDateBefore(LocalDate.now());
        userBookList.parallelStream().forEach(userBook -> {
            User user = userBook.getUser();
            Book book = userBook.getBook();
            new Thread(() -> {
                String message = "Your borrowed book titled \"" + book.getTitle() +
                        "\" was due on " + userBook.getExpectedReturnDate() + ". Please return it as soon as possible.";
                simpMessagingTemplate.convertAndSendToUser(user.getId().toString(), "/messages", message);
            }).start();

            new Thread(() -> {
                String body = "<b>Dear " + user.getFirstName() + ",</b></br>" +
                        "<br>We hope you're enjoying your book! This is a friendly reminder that the book titled <b>\"" + book.getTitle() +
                        "\"</b> you borrowed was due for return on <b>" + userBook.getExpectedReturnDate() + "</b></br>" +
                        "To avoid any late fees, please return the book at your earliest convenience." +
                        "If you need more time, please reach out to us so we can assist with extending the due date if possible.<br/>" +
                        "Thank you for your attention to this matter. We appreciate your prompt action.";
                emailService.sendMail(user.getEmail(), "Book Return Due", body);
            }).start();
        });
    }
}
