package library.models;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "book_author")
public class BookAuthor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="book_id")
    private Long bookId;

    @Column(name = "author_id")
    private Long authorId;

    @Setter(AccessLevel.NONE)
    @ManyToOne
    @JoinColumn(name = "book_id",referencedColumnName = "id", insertable = false, updatable = false)
    private Book book;

    @Setter(AccessLevel.NONE)
    @ManyToOne
    @JoinColumn(name = "author_id",referencedColumnName = "id", insertable = false, updatable = false)
    private Author author;
}
