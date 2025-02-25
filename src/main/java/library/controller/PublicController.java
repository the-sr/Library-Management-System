package library.controller;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import library.config.jwt.JwtUtil;
import library.dto.OTPDto;
import library.dto.PasswordDto;
import library.dto.UserDto;
import library.dto.LoginDto;
import library.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class PublicController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;

    @Operation(summary = "Sign Up and Registration")
    @PostMapping("/sign-up")
    public ResponseEntity<?> save(@Valid @RequestBody UserDto req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.save(req));
    }

    @PostMapping("/validate-signup-otp")
    public ResponseEntity<?> validateSignUpOTP(@RequestBody OTPDto req) {
        return ResponseEntity.status(HttpStatus.OK).body(userService.validateSignupOTP(req));
    }

    @PostMapping("/sign-in")
    public ResponseEntity<?> login(@RequestBody LoginDto req) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getUsername(), req.getPassword()));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        final UserDetails userDetails = userDetailsService.loadUserByUsername(req.getUsername());
        final String token = jwtUtil.generateToken(userDetails);
        return ResponseEntity.ok().body(LoginDto.builder().token(token).build());
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
