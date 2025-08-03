package library.utils;

import library.exception.CustomException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

@Component
@RequiredArgsConstructor
public class OtpService {

    private static final ConcurrentHashMap<String, Map<String,Object>> otpMap=new ConcurrentHashMap<>();

    public String generateOtp(String identifier){
        Random random = new Random();
        StringBuilder otp = new StringBuilder();
        for (int i = 0; i < 6; i++)
            otp.append(random.nextInt(10));
        Map<String, Object> otpDetails = Map.of(
                "otp", otp,
                "creationTime", LocalDateTime.now()
        );
        otpMap.put(identifier,otpDetails);
        return otp.toString();
    }

    public boolean validateOtp(String identifier, String otp) {
        Map<String, Object> otpDetails = otpMap.get(identifier);
        if (otpDetails == null) {
            throw new CustomException("Invalid or expired OTP. Please request a new one.");
        } else {
            if (isExpired((LocalDateTime) otpDetails.get("creationTime"))) {
                throw new CustomException("OTP has already expired. Please request for new one.");
            } else {
                otpMap.remove(identifier);
                return true;
            }
        }
    }

    public void removeExpiredOtps(){
        if(!otpMap.isEmpty()){
            otpMap.entrySet().removeIf(entry->{
                Map<String,Object> otpDetails=entry.getValue();
                return isExpired((LocalDateTime) otpDetails.get("creationTime"));
            });
        }
    }


    public boolean isExpired(LocalDateTime creationTime){
        return LocalDateTime.now().isAfter(creationTime.plusMinutes(5));
    }
}
