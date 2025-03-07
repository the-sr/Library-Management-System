package library.models;

import jakarta.persistence.*;
import library.enums.Role;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "users",
        indexes = {@Index(name = "indexed_user_email", columnList = "email", unique = true)}
)
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "middle_name")
    private String middleName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "email", unique = true)
    private String email;

    @Column(name = "password")
    private String password;

    @Column(name = "profile_picture")
    private String profilePicture;

    @Enumerated(EnumType.STRING)
    @Column(name = "role")
    private Role role;

    @Column(name = "phone")
    private String phone;

    @Column(name = "created_date")
    private LocalDate createdDate;

    @Column(name = "updated_date")
    private LocalDate updatedDate;

    @Column(name = "borrowed_book_count")
    private Integer borrowedBookCount;

    @Column(name = "is_active", columnDefinition = "boolean default false")
    private Boolean isActive;

    @OneToMany(mappedBy = "user")
    private List<Address> address;

    @OneToMany(mappedBy = "user",cascade = CascadeType.REMOVE)
    private List<Review> review;

    @PrePersist
    private void onCreate() {
        isActive = false;
        createdDate= LocalDate.now();
        borrowedBookCount=0;
    }
}