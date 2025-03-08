package library.services.impl;

import library.config.security.AuthenticationFacade;
import library.dto.UserBookDto;
import library.enums.RequestType;
import library.exception.CustomException;
import library.models.Book;
import library.models.User;
import library.models.UserBook;
import library.repository.BookRepo;
import library.repository.UserBookRepo;
import library.repository.UserRepo;
import library.services.UserBookService;
import library.services.mappers.UserBookMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserBookServiceImpl implements UserBookService {

    private final AuthenticationFacade facade;
    private final UserRepo userRepo;
    private final BookRepo bookRepo;
    private final UserBookRepo userBookRepo;
    private final UserBookMapper userBookMapper;

    @Value("${default-borrow-limit}")
    private Integer borrowLimit;
    @Value("${default-borrow-period-limit}")
    private Long borrowPeriodLimit;


    @Transactional
    @Override
    public String borrowRequest(Long bookId) {
        long userId = facade.getAuthentication().getUserId();
        User user = userRepo.findById(userId).orElseThrow(() -> new CustomException("User not found", HttpStatus.NOT_FOUND));
        if (user.getBorrowedBookCount() >= borrowLimit)
            throw new CustomException("Maximum borrow limit is " + borrowLimit, HttpStatus.BAD_REQUEST);
        if (userBookRepo.findByUserIdAndBookId(userId, bookId).isPresent())
            throw new CustomException("Book already borrowed", HttpStatus.CONFLICT);
        Book book = bookRepo.findById(bookId).orElseThrow(() -> new CustomException("Book not found", HttpStatus.NOT_FOUND));
        if (book.getBookCount() < 1)
            throw new CustomException("Book is out of stock", HttpStatus.BAD_REQUEST);
        UserBook userBook = UserBook.builder()
                .requestType(RequestType.BORROW)
                .userId(userId)
                .bookId(book.getId())
                .build();
        userBookRepo.save(userBook);
        user.setBorrowedBookCount(user.getBorrowedBookCount() + 1);
        userBookRepo.save(userBook);
        book.setBookCount(book.getBookCount() - 1);
        bookRepo.save(book);
        return "Your book borrow request was successful. Please visit the library to pick up your book with a week.";
    }

    @Transactional
    @Override
    public String cancelBorrowRequest(Long userBookId) {
        UserBook userBook=userBookRepo.findById(userBookId).orElseThrow(()->new CustomException("User Book not found",HttpStatus.NOT_FOUND));
        if(userBook.getExpectedReturnDate()==null && userBook.getRequestType()==RequestType.BORROW){
            User user=userRepo.findById(userBook.getUserId()).orElseThrow(()->new CustomException("User not found",HttpStatus.NOT_FOUND));
            user.setBorrowedBookCount(user.getBorrowedBookCount()-1);
            userRepo.save(user);
            Book book=bookRepo.findById(userBook.getBookId()).orElseThrow(() -> new CustomException("Book not found", HttpStatus.NOT_FOUND));
            book.setBookCount(book.getBookCount()+1);
            bookRepo.save(book);
            userBookRepo.delete(userBook);
            return "Borrow Request successfully canceled";
        }else throw new CustomException("Invalid Request",HttpStatus.BAD_REQUEST);
    }

    @Override
    public String handelBorrowRequest(Long userBookId) {
        UserBook userBook = userBookRepo.findById(userBookId).orElseThrow(() -> new CustomException("User Book not found", HttpStatus.NOT_FOUND));
        if(userBook.getRequestType()==RequestType.BORROW && userBook.getExpectedReturnDate()==null) {
            userBook.setBorrowedDate(LocalDate.now());
            userBook.setExpectedReturnDate(LocalDate.now().plusMonths(borrowPeriodLimit));
            userBookRepo.save(userBook);
            return "Book successfully borrowed";
        }else throw new CustomException("Invalid Request",HttpStatus.BAD_REQUEST);
    }

    @Transactional
    @Override
    public String returnRequest(Long userBookId) {
        long userId = facade.getAuthentication().getUserId();
        UserBook userBook = userBookRepo.findById(userBookId).orElseThrow(() -> new CustomException("You haven't borrowed this book yet", HttpStatus.BAD_REQUEST));
        if(userBook.getExpectedReturnDate() != null && userBook.getRequestType()==RequestType.BORROW){
            double fineAmount = 0;
            if (LocalDate.now().isAfter(userBook.getExpectedReturnDate()))
                fineAmount = 2500;
            userBook.setFineAmount(fineAmount);
            userBook.setRequestType(RequestType.RETURN);
            userBookRepo.save(userBook);
            if (fineAmount > 0)
                return "Your book return request was successful. Please visit the library with fine amount Rs." + fineAmount + " to return the book";
            else return "Your book return request was successful. Please visit the library to return the book";
        }else throw new CustomException("Invalid request",HttpStatus.BAD_REQUEST);
    }

    @Override
    public String cancelReturnRequest(Long userBookId) {
        UserBook userBook = userBookRepo.findById(userBookId).orElseThrow(() -> new CustomException("User Book not found", HttpStatus.NOT_FOUND));
        if(userBook.getExpectedReturnDate()!=null && userBook.getRequestType()==RequestType.RETURN){
            userBook.setFineAmount(0.0);
            userBook.setRequestType(RequestType.BORROW);
            userBookRepo.save(userBook);
            return "Return Request successfully canceled";
        }else throw new CustomException("Invalid request",HttpStatus.BAD_REQUEST);
    }

    @Transactional
    @Override
    public String handelReturnRequest(Long userBookId) {
        UserBook userBook = userBookRepo.findById(userBookId).orElseThrow(() -> new CustomException("User Book not found", HttpStatus.NOT_FOUND));
        if(userBook.getIsActive() && userBook.getRequestType()==RequestType.RETURN && userBook.getExpectedReturnDate()!=null) {
            userBook.setIsActive(false);
            userBookRepo.save(userBook);
            User user = userRepo.findById(userBook.getUserId()).orElseThrow(() -> new CustomException("User not found", HttpStatus.NOT_FOUND));
            user.setBorrowedBookCount(user.getBorrowedBookCount() - 1);
            userRepo.save(user);
            Book book = bookRepo.findById(userBook.getBookId()).orElseThrow(() -> new CustomException("Book not found", HttpStatus.NOT_FOUND));
            book.setBookCount(book.getBookCount() + 1);
            bookRepo.save(book);
            return "Book successfully returned";
        }else throw new CustomException("Invalid Request", HttpStatus.BAD_REQUEST);
    }

    @Override
    public UserBookDto getById(Long userBookId) {
        return userBookMapper.entityToDto(userBookRepo.findById(userBookId).orElseThrow(() -> new CustomException("User Book not found", HttpStatus.NOT_FOUND)));
    }

    @Override
    public List<UserBookDto> getAll(Long userId, String requestType, Boolean isActive) {
        List<UserBook> userBookList = userBookRepo.findAll(userId, requestType, isActive);
        return userBookList.parallelStream().map(userBookMapper::entityToDto).collect(Collectors.toList());
    }
}
