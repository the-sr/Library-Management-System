package library.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "preferred_author")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PreferredAuthor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "author_id")
    private Long authorId;

    @Setter(AccessLevel.NONE)
    @ManyToOne
    @JoinColumn(name = "user_id",referencedColumnName = "id",insertable = false,updatable = false)
    private User user;

    @Setter(AccessLevel.NONE)
    @ManyToOne
    @JoinColumn(name = "author_id",referencedColumnName = "id",insertable = false,updatable = false)
    private Author author;
}
