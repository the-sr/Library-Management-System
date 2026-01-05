package library.controller;

import io.swagger.v3.oas.annotations.Operation;
import library.dto.PasswordDto;
import library.dto.ResponseDto;
import library.dto.UserDto;
import library.services.UserService;
import library.utils.AppConstants;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserRestController {

    private final UserService userService;

    @PostMapping(value = "/user/add-profile-picture")
    public ResponseEntity<?> addProfilePicture(@RequestPart MultipartFile profilePicture) {
        return ResponseEntity.ok(ResponseDto.builder().message(userService.addProfilePicture(profilePicture)).build());
    }

    @Operation(summary = "Get Profile")
    @GetMapping("/user/me")
    public ResponseEntity<?> getProfile() {
        return ResponseEntity.ok(ResponseDto.builder().data(userService.getProfile()).build());
    }

    @Operation(summary = "Get user by ID")
    @PreAuthorize("hasAnyAuthority('ADMIN','LIBRARIAN')")
    @GetMapping("/user/{id}")
    public ResponseEntity<?> getUser(@PathVariable long id) {
        return ResponseEntity.ok(ResponseDto.builder().data(userService.findById(id)).build());
    }

    @Operation(summary = "Get all users")
    @PreAuthorize("hasAnyAuthority('ADMIN','LIBRARIAN')")
    @GetMapping("/users")
    public ResponseEntity<?> getUsers(@RequestParam(required = false) Boolean status) {
        return ResponseEntity.ok(ResponseDto.builder().data(userService.getAllUsers(status)).build());
    }

    @Operation(summary = "Get all users page wise")
    @PreAuthorize("hasAnyAuthority('ADMIN','LIBRARIAN')")
    @GetMapping("/page-wise-users")
    public ResponseEntity<?> getUsersPageWise(@RequestParam("pageNumber") Integer pageNumber,
                                              @RequestParam(value = "pageSize", defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize,
                                              @RequestParam(value = "sortBy", defaultValue = AppConstants.SORT_BY, required = false) String sortBy,
                                              @RequestParam(value = "sortDirection", defaultValue = AppConstants.SORT_DIRECTION, required = false) String sortDirection,
                                              @RequestParam(required = false) Boolean status) {
        return ResponseEntity.ok(ResponseDto.builder().data(userService.getAllUsers(pageNumber, pageSize, sortBy, sortDirection, status)).build());
    }

    @Operation(summary = "Update user")
    @PutMapping("/user/me")
    public ResponseEntity<?> updateUser(@RequestBody UserDto req) {
        return ResponseEntity.ok(ResponseDto.builder().data(userService.updateProfile(req)).build());
    }

    @Operation(summary = "Update password")
    @PutMapping("/user/update-password")
    public ResponseEntity<?> updatePassword(@RequestBody PasswordDto req) {
        return ResponseEntity.ok(ResponseDto.builder().message(userService.updatePassword(req)).build());
    }

    @Operation(summary = "Delete user by ID")
    @DeleteMapping("user/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable long id) {
        return ResponseEntity.ok(ResponseDto.builder().message(userService.deleteById(id)).build());
    }

}
