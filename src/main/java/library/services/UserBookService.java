package library.services;

import library.dto.UserBookDto;

import java.util.List;

public interface UserBookService {

    String borrowRequest(Long bookId);

    String cancelBorrowRequest(Long userBookId);

    String handelBorrowRequest(Long userBookId);

    String returnRequest(Long userBookId);

    String cancelReturnRequest(Long userBookId);

    String handelReturnRequest(Long userBookId);

    UserBookDto getById(Long userBookId);

    List<UserBookDto> getAll(Long userId, String requestType, Boolean isActive);

}
