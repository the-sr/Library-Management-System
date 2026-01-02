package library.dto;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@RequiredArgsConstructor
@AllArgsConstructor
@Builder
public class UserBookDto {

    private Long id;

    private LocalDate borrowedDate;

    private LocalDate returnDate;

    private LocalDate expectedReturnDate;

    private Boolean isActive;

    private Double fineAmount;

    private String requestType;

    private Long userId;

    private Long bookId;

    private UserDto user;

    private BookDto book;
}