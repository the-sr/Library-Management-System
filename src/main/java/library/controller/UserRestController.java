package library.controller;

import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import library.dto.PasswordDto;
import library.dto.UserDto;
import library.services.UserService;
import library.utils.AppConstants;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserRestController {

    private final UserService userService;

    //TODO
    @PostMapping(value = "/users/add-profile-picture",consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> addProfilePicture(@RequestParam Long userId,@RequestPart MultipartFile profilePicture){
        return ResponseEntity.ok().body(userService.addProfilePicture(userId,profilePicture));
    }

    @Operation(summary = "Get Profile")
    @GetMapping("/users/me")
    public ResponseEntity<?> getProfile() {
        return ResponseEntity.status(HttpStatus.OK).body(userService.getProfile());
    }

    @Operation(summary = "Get user by ID")
    @GetMapping("/users/{id}")
    public ResponseEntity<?> getUser(@PathVariable("id") long id) {
        return ResponseEntity.status(HttpStatus.OK).body(userService.findById(id));
    }

    @Operation(summary = "Get all users")
    @PreAuthorize("hasAnyAuthority('ADMIN','LIBRARIAN')")
    @GetMapping("/users")
    public ResponseEntity<?> getUsers(@RequestParam(required = false) Boolean status) {
        return ResponseEntity.ok().body(userService.getAllUsers(status));
    }

    @Operation(summary = "Get all users page wise")
    @PreAuthorize("hasAnyAuthority('ADMIN','LIBRARIAN')")
    @GetMapping("/page-wise-users")
    public ResponseEntity<?> getUsersPageWise(
            @RequestParam("pageNumber") Integer pageNumber,
            @RequestParam(value = "pageSize", defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize,
            @RequestParam(value = "sortBy", defaultValue = AppConstants.SORT_BY, required = false) String sortBy,
            @RequestParam(value = "sortDirection", defaultValue = AppConstants.SORT_DIRECTION, required = false) String sortDirection,
            @RequestParam(required = false) Boolean status) {
        return ResponseEntity.ok().body(userService.getAllUsers(pageNumber, pageSize, sortBy, sortDirection,status));
    }

    @Operation(summary = "Update user")
    @PutMapping("/users/me")
    public ResponseEntity<?> updateUser(@Valid @RequestBody UserDto req) {
        return ResponseEntity.ok().body(userService.updateProfile(req));
    }

    @Operation(summary = "Update password")
    @PutMapping("/users/update-password")
    public ResponseEntity<?> updatePassword(@RequestBody PasswordDto req) {
        return ResponseEntity.ok().body(userService.updatePassword(req));
    }

    @Operation(summary = "Delete user by ID")
    @DeleteMapping("user/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable("id") long id) {
        return ResponseEntity.ok().body(userService.deleteById(id));
    }

}
