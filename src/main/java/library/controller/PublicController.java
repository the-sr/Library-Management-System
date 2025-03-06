package library.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
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

    @Operation(
            summary = "Sign Up and Registration",
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    content = @Content(
                            mediaType = "multipart/form-data",
                            schema = @Schema(implementation = UserDto.class)
                    )
            )
    )
    @PostMapping("/sign-up")
    public ResponseEntity<?> signUp(@Valid @ModelAttribute UserDto req) {
        return ResponseEntity.status(HttpStatus.CREATED).body("User registered successfully");
    }

    @PostMapping("/activate-account")
    public ResponseEntity<?> activateAccount(@RequestBody OTPDto req) {
        return ResponseEntity.status(HttpStatus.OK).body(userService.activateAccount(req));
    }

    @PostMapping("/sign-in")
    public ResponseEntity<?> signIn(@RequestBody LoginDto req) {
        return ResponseEntity.status(HttpStatus.OK).body(userService.signIn(req));
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
