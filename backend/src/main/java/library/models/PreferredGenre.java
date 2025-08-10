package library.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "preferred_genre")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PreferredGenre {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "genre_id")
    private Long genreId;

    @Setter(AccessLevel.NONE)
    @ManyToOne
    @JoinColumn(name = "user_id",referencedColumnName = "id",insertable = false,updatable = false)
    private User user;

    @Setter(AccessLevel.NONE)
    @ManyToOne
    @JoinColumn(name = "genre_id",referencedColumnName = "id",insertable = false,updatable = false)
    private Genre genre;

}
