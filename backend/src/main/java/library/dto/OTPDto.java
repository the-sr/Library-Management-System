package library.dto;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor

public class OTPDto {
    private String OTP;
    private String email;
    private String token;
}
