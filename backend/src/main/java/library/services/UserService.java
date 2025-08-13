package library.services;

import java.util.List;

import library.dto.*;
import org.springframework.web.multipart.MultipartFile;

public interface UserService {

    String signUp(UserDto req);

    String activateAccount(OTPDto req);

    Object signIn(LoginDto req);

    String addProfilePicture(Long userId, MultipartFile profilePicture);

    UserDto getProfile();

    UserDto findById(long id);

    List<UserDto> getAllUsers(Boolean status);

    PageWiseResDto<UserDto> getAllUsers(Integer pageNumber, Integer pageSize, String sortBy, String sortDirection, Boolean status);

    String deleteById(long id);

    UserDto updateProfile(UserDto req);

    String forgotPassword(OTPDto req);

    OTPDto validateOTP(OTPDto req);

    String resetPassword(PasswordDto req);

    String updatePassword(PasswordDto req);

}
