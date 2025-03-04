package library.controller;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import library.dto.OTPDto;
import library.dto.PasswordDto;
import library.dto.UserDto;
import library.dto.LoginDto;
import library.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class PublicController {

    private final UserService userService;

    @Operation(summary = "Sign Up and Registration")
    @PostMapping("/sign-up")
    public ResponseEntity<?> save(@Valid @ModelAttribute UserDto req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.save(req));
    }

    @PostMapping("/validate-signup-otp")
    public ResponseEntity<?> validateSignUpOTP(@RequestBody OTPDto req) {
        return ResponseEntity.status(HttpStatus.OK).body(userService.validateSignupOTP(req));
    }

    @PostMapping("/sign-in")
    public ResponseEntity<?> login(@RequestBody LoginDto req) {
        return ResponseEntity.status(HttpStatus.OK).body(userService.login(req));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody OTPDto req){
        return ResponseEntity.ok().body(userService.forgotPassword(req));
    }

    @PostMapping("/validate-otp")
    public ResponseEntity<?> validateOTP(@RequestBody OTPDto req){
        return ResponseEntity.ok().body(userService.validateOTP(req));
    }

    @PutMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody PasswordDto req) {
        return ResponseEntity.ok().body(userService.resetPassword(req));
    }

}
