package library.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;
import library.enums.Role;
import lombok.*;
import org.hibernate.validator.constraints.Length;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserDto {

    private Long id;

    @NotEmpty(message = "Please enter a valid name")
    private String name;

    @Email(message = "Invalid Email")
    private String email;

    @Length(min = 5, max = 15, message = "Password must be 5 to 15 character long")
    private String password;

    private String confirmPassword;

    private String profilePicture;

    private Role role;

    private String phone;

    private LocalDate createdDate;

    private LocalDate updatedDate;

    private Integer borrowedBookCount;

    private Boolean isActive;

    private List<AddressDto> address;
}