package library.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewDto {

    private Long id;
    private String comment;
    private Integer rating;
    private LocalDateTime createdDate;
    private LocalDateTime editedDate;
    private Long userId;
    private Long bookId;
    private Long reviewsId;
    private UserDto user;
    private BookDto book;
    private ReviewDto reviews;

}
