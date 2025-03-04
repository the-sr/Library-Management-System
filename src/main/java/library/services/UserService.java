package library.services;

import java.util.List;

import library.dto.*;

public interface UserService {

    String save(UserDto req);

    String validateSignupOTP(OTPDto req);

    LoginDto login(LoginDto req);

    UserDto findById(long id);

    List<UserDto> getAllUsers(Boolean status);

    PageWiseResDto<UserDto> getAllUsers(Integer pageNumber, Integer pageSize, String sortBy, String sortDirection, Boolean status);

    String deleteById(long id);

    UserDto updateById(UserDto req);

    String forgotPassword(OTPDto req);

    OTPDto validateOTP(OTPDto req);

    String resetPassword(PasswordDto req);

    String updatePassword(PasswordDto req);

}
