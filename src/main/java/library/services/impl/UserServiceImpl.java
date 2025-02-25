package library.services.impl;

import library.dto.OTPDto;
import library.dto.PasswordDto;
import library.services.AddressService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import library.dto.UserDto;
import library.dto.PageWiseResDto;
import library.exception.CustomException;
import library.models.User;
import library.repository.UserRepo;
import library.services.UserService;
import library.services.mappers.UserMapper;
import library.utils.EmailService;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserRepo userRepo;
    private final UserMapper userMapper;
    private final AddressService addressService;
    private final EmailService emailService;

    @Value("${otp-length}")
    private String optLength;

    private static Map<String, Integer> optMap = new HashMap<>();
    private static Map<String, String> tokenMap = new HashMap<>();

    @Override
    public String save(UserDto req) {
        if (userRepo.existsByEmail(req.getEmail()))
            throw new CustomException("Email already registered", HttpStatus.BAD_REQUEST);
        if (!req.getPassword().equals(req.getConfirmPassword()))
            throw new CustomException("Confirm Password and Password must be same", HttpStatus.BAD_REQUEST);
        new Thread(()->{
            int otp = (int) (Math.pow(10, Integer.parseInt(optLength) - 1) + Math.random() * 9 * Math.pow(10, Integer.parseInt(optLength) - 1));
            optMap.put(req.getEmail(), otp);
            String body="<b>Dear "+req.getFirstName()+",</b></br>" +
                    "</br><b>Hello and Welcome !</b></br></br>" +
                    "</br>To complete your account verification, please use the One-Time Password (OTP) below:</br></br><b>Your OTP: "+otp+ "</b></br>" +
                    "</br>This OTP is valid for <b>5 minutes</b>. Please do not share it with anyone for security reasons.</br>" +
                    "</br>If you didn't request this, please ignore this email.";
            emailService.sendMail(req.getEmail(), "Verify your Account", body);
        }).start();
        User user = userRepo.save(userMapper.dtoToEntity(req));
        if (req.getAddress() != null) {
            req.getAddress().parallelStream().forEach(address -> {
                address.setUserId(user.getId());
                addressService.saveAddress(address);
            });
        }
        return "Please check you email for OPT to verify your account and proceed further";
    }

    @Override
    public String validateSignupOTP(OTPDto req) {
        if (optMap.containsKey(req.getEmail())) {
            if (optMap.get(req.getEmail()).equals(req.getOTP()))
                return "Your account has been verified";
            else throw new CustomException("Invalid OTP", HttpStatus.BAD_REQUEST);
        } else throw new CustomException("Invalid request", HttpStatus.BAD_REQUEST);
    }

    @Override
    public UserDto findById(long id) {
        User user = userRepo.findById(id).orElseThrow(() -> new CustomException("User not found", HttpStatus.NOT_FOUND));
        return userMapper.entityToDto(user);
    }

    @Override
    public List<UserDto> getAllUsers(Boolean status) {
        List<User> userList = userRepo.findAllByIsActive(status);
        return userList.stream().map(userMapper::entityToDto).collect(Collectors.toList());
    }

    @Override
    public PageWiseResDto<UserDto> getAllUsers(Integer pageNumber, Integer pageSize, String sortBy, String sortDirection, Boolean status) {
        Sort sort = null;
        if (sortDirection.equalsIgnoreCase("asc")) sort = Sort.by(sortBy).ascending();
        else if (sortDirection.equalsIgnoreCase("desc")) sort = Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);
        Page<User> users = userRepo.findAllPagewiseByIsActive(pageable, status);
        List<UserDto> res = users.stream().map(userMapper::entityToDto).collect(Collectors.toList());
        PageWiseResDto<UserDto> pageWiseResDto = new PageWiseResDto<>();
        pageWiseResDto.setRes(res);
        pageWiseResDto.setTotalPages(users.getTotalPages());
        pageWiseResDto.setTotalElements(users.getTotalElements());
        pageWiseResDto.setCurrentPage(users.getNumber());
        pageWiseResDto.setPageSize(users.getSize());
        pageWiseResDto.setLast(users.isLast());
        return pageWiseResDto;
    }

    @Override
    public UserDto updateById(UserDto req) {
        User user = userRepo.findById(req.getId()).orElseThrow(() -> new CustomException("User Not Found", HttpStatus.NOT_FOUND));
        user.setFirstName(req.getFirstName());
        user.setMiddleName(req.getMiddleName());
        user.setLastName(req.getLastName());
        if (userRepo.existsByEmail(req.getEmail()))
            throw new CustomException("Email already registered", HttpStatus.BAD_REQUEST);
        user.setEmail(req.getEmail());
        user.setPhone(req.getPhone());
        user.setUpdatedDate(LocalDate.now());
        return userMapper.entityToDto(userRepo.save(user));
    }

    @Override
    public String forgotPassword(OTPDto req) {
        if (userRepo.existsByEmail(req.getEmail())) {
            int otp = (int) (Math.pow(10, Integer.parseInt(optLength) - 1) + Math.random() * 9 * Math.pow(10, Integer.parseInt(optLength) - 1));
            optMap.put(req.getEmail(), otp);
            String body = "Your one-time password (OTP) for resetting your password is <b>" + otp + "</b>. This code will expire in 5 minutes. Please enter it promptly to complete your request.";
            emailService.sendMail(req.getEmail(), "Forgot Password Request", body);
        }
        return "Please check you email for OPT to change password";
    }

    @Override
    public OTPDto validateOTP(OTPDto req) {
        if (optMap.containsKey(req.getEmail())) {
            if (optMap.get(req.getEmail()).equals(req.getOTP())) {
                String token = "just_a_random_token";
                tokenMap.put(req.getEmail(), token);
                return OTPDto.builder().token(token).build();
            } else throw new CustomException("Invalid OTP", HttpStatus.BAD_REQUEST);
        } else throw new CustomException("Invalid request", HttpStatus.BAD_REQUEST);
    }

    @Override
    public String resetPassword(PasswordDto req) {
        if (tokenMap.containsKey(req.getEmail())) {
            if (tokenMap.get(req.getEmail()).equals(req.getToken())) {
                User user = userRepo.findByUsername(req.getEmail()).orElseThrow(() -> new CustomException("User not found", HttpStatus.NOT_FOUND));
                user.setPassword(new BCryptPasswordEncoder().encode(req.getNewPassword()));
                userRepo.save(user);
                return "Password changed successfully";
            } else throw new CustomException("Invalid request", HttpStatus.BAD_REQUEST);
        } else throw new CustomException("Invalid request", HttpStatus.BAD_REQUEST);
    }

    @Override
    public String updatePassword(PasswordDto req) {
        if (req.getOldPassword() != null && !req.getOldPassword().isEmpty()) {
            User user = userRepo.findByUsername(req.getEmail()).orElseThrow(() -> new CustomException("User not found", HttpStatus.NOT_FOUND));
            if (new BCryptPasswordEncoder().matches(req.getOldPassword(), user.getPassword())) {
                user.setPassword(new BCryptPasswordEncoder().encode(req.getNewPassword()));
                userRepo.save(user);
                return "Password changed successfully";
            } else throw new CustomException("Incorrect old password", HttpStatus.BAD_REQUEST);
        }else throw new CustomException("Invalid Request",HttpStatus.BAD_REQUEST);
    }

    @Override
    public String deleteById(long id) {
        User user = userRepo.findById(id).orElseThrow(() -> new CustomException("User not found", HttpStatus.NOT_FOUND));
        user.setIsActive(false);
        user.setUpdatedDate(LocalDate.now());
        userRepo.save(user);
        emailService.sendMail(user.getEmail(), "Account Deletion", "Your account will be deleted within a month. ");
        return "Your account will be deleted within a month";
    }

    public static void clearOTPMap() {
        optMap.clear();
        log.info("OTP map cleared");
    }

    public static void clearTokenMap() {
        tokenMap.clear();
        log.info("Token map cleared");
    }
}
