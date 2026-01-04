package library.controller;

import jakarta.validation.Valid;
import library.dto.*;
import library.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class PublicController {

    private final UserService userService;

    @PostMapping("/sign-up")
    public ResponseEntity<?> signUp(@Valid @RequestBody UserDto req) {
        return ResponseEntity.ok(ResponseDto.builder().message(userService.signUp(req)).build());
    }

    @PostMapping("/activate-account")
    public ResponseEntity<?> activateAccount(@RequestBody OTPDto req) {
        return ResponseEntity.ok(ResponseDto.builder().message(userService.activateAccount(req)).build());
    }

    @PostMapping("/sign-in")
    public ResponseEntity<?> signIn(@RequestBody LoginDto req) {
        return ResponseEntity.ok(ResponseDto.builder().data(userService.signIn(req)).build());
    }

    @PostMapping("/otp")
    public ResponseEntity<?> resendOTP(@RequestBody OTPDto req) {
        return ResponseEntity.ok(ResponseDto.builder().message(userService.otp(req)).build());
    }

    @PostMapping("/validate-otp")
    public ResponseEntity<?> validateOTP(@RequestBody OTPDto req) {
        return ResponseEntity.ok(ResponseDto.builder().data(userService.validateOTP(req)).build());
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody OTPDto req) {
        return ResponseEntity.ok(ResponseDto.builder().message(userService.forgotPassword(req)).build());
    }

    @PutMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody PasswordDto req) {
        return ResponseEntity.ok(ResponseDto.builder().message(userService.resetPassword(req)).build());
    }

}