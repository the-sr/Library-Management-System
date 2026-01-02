package library.models;

import jakarta.persistence.*;
import library.enums.AddressType;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "address",
        indexes = {
                @Index(name = "indexed_address_type", columnList = "address_type")
        })
public class Address {

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private AddressType addressType;

    @Column(name = "is_per_temp_same")
    private Boolean isPerTempSame;

    @Column(name = "street")
    private String street;

    @Column(name = "city")
    private String city;

    @Column(name = "state")
    private String state;

    @Column(name = "zip")
    private String zip;

    @Column(name = "country")
    private String country;

    @Column(name="user_id")
    private Long userId;

    @Getter(AccessLevel.NONE)
    @Setter(AccessLevel.NONE)
    @ManyToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id", insertable = false, updatable = false)
    private User user;
}