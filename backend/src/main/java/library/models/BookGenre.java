package library.models;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "book_genre")
public class BookGenre {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "book_id")
    private Long bookId;

    @Column(name = "genre_id")
    private Long genreId;

    @Setter(AccessLevel.NONE)
    @ManyToOne
    @JoinColumn(name = "book_id",referencedColumnName = "id", insertable = false, updatable = false)
    private Book book;

    @Setter(AccessLevel.NONE)
    @ManyToOne
    @JoinColumn(name = "genre_id", referencedColumnName = "id", insertable = false, updatable = false)
    private Genre genre;
}
