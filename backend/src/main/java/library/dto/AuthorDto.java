package library.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor

public class AuthorDto {

    private Long id;
    @NotNull(message = "First Name is required.")
    private String firstName;
    @NotNull(message = "First Name is required.")
    private String lastName;
    @Email(message = "Invalid Email Format, Please provide a valid email")
    private String email;
    private String phone;
}