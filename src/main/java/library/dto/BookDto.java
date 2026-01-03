package library.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BookDto {

    private Long id;

    @NotNull(message = "ISBN is required")
    private String isbn;

    @NotNull(message = "Book Title is required")
    private String title;

    private String edition;

    @NotNull(message = "Publisher Name is required")
    private String publisher;

    @Min(value = 1, message = "Minimum Number of book is ONE")
    private Integer bookCount;

    @Min(0)
    @Max(5)
    private Float averageRating;

    @NotNull(message = "Author Details is required")
    private List<AuthorDto> authors;

    @NotNull(message = "At least 1 genre is required")
    private List<GenreDto> genre;

    private List<ReviewDto> review;
}