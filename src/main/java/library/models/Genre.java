package library.models;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "genre")
@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor

public class Genre {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @OneToMany(mappedBy = "genre", cascade = CascadeType.REMOVE)
    private List<BookGenre> bookGenre;
}
