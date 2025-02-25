package library.dto;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor

public class OTPDto {
    private int OTP;
    private String email;
    private String token;
}
