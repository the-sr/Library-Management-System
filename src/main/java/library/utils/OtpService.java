package library.utils;

import library.exception.CustomException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Component
@RequiredArgsConstructor
public class OtpService {

    private static final ConcurrentHashMap<String, Map<String, Object>> otpMap = new ConcurrentHashMap<>();

    public String generateOtp(String identifier) {
        Random random = new Random();
        identifier = (identifier != null) ? identifier : generateIdentifier();
        StringBuilder otp = new StringBuilder();
        for (int i = 0; i < 6; i++)
            otp.append(random.nextInt(10));
        Map<String, Object> otpDetails = Map.of("otp", otp, "creationTime", LocalDateTime.now());
        otpMap.put(identifier, otpDetails);
        return otp.toString();
    }

    public boolean validateOtp(String identifier, String otp) {
        Map<String, Object> otpDetails = otpMap.get(identifier);
        if (otpDetails == null || isExpired(otpDetails.get("creationTime"))) return false;
        else {
            if (otpDetails.get("otp").equals(otp)) {
                otpMap.remove(identifier);
                return true;
            } else throw new CustomException("Invalid OTP. Please try again");
        }
    }

    public void removeExpiredOtp() {
        if (!otpMap.isEmpty()) {
            otpMap.entrySet().removeIf(entry -> {
                Map<String, Object> otpDetails = entry.getValue();
                return isExpired(otpDetails.get("creationTime"));
            });
        }
    }

    private boolean isExpired(Object creationTime) {
        try {
            LocalDateTime temp = (LocalDateTime) creationTime;
            return LocalDateTime.now().isAfter(temp.plusMinutes(5));
        } catch (Exception e) {
            throw new CustomException("Error parsing date time");
        }
    }

    private String generateIdentifier() {
        byte[] array = new byte[20];
        new Random().nextBytes(array);
        return new String(array, StandardCharsets.UTF_8);
    }
}
