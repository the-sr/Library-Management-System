package library.models;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "book",indexes = {
        @Index(name = "indexed_book_isbn", columnList = "isbn", unique = true),
})
public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "isbn")
    private String isbn;

    @Column(name = "title")
    private String title;

    @Column(name = "edition")
    private String edition;

    @Column(name = "publisher")
    private String publisher;

    @Column(name = "book_count")
    private Integer bookCount;

    @Column(name = "average_rating")
    private Float averageRating;

    @OneToMany(mappedBy = "book",cascade = CascadeType.REMOVE)
    private List<BookAuthor> bookAuthor;

    @OneToMany(mappedBy = "book", cascade = CascadeType.REMOVE)
    private List<BookGenre> bookGenre;

    @OneToMany(mappedBy = "book", fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
    private List<Review> reviews;

}