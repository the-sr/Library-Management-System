package library.dto;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor

public class OTPDto {
    private String otp;
    private String identifier;
}
