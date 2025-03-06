package library.services.impl;

import library.config.jwt.JwtUtil;
import library.config.security.AuthenticatedUser;
import library.dto.*;
import library.services.AddressService;
import library.services.FileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

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
    private final FileService fileService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;

    @Value("${otp-length}")
    private String optLength;
    private static final Map<String, Integer> otpMap = new HashMap<>();
    private static final Map<String, String> tokenMap = new HashMap<>();

    @Override
    public String signUp(UserDto req) {
        if (userRepo.findByEmail(req.getEmail()).isPresent())
            throw new CustomException("Email already registered", HttpStatus.CONFLICT);
        if (!req.getPassword().equals(req.getConfirmPassword()))
            throw new CustomException("Confirm Password and Password must be same", HttpStatus.BAD_REQUEST);
        new Thread(()->{
            int otp = getOtp(req.getEmail());
            String body="<b>Dear "+req.getFirstName()+",</b></br>" +
                    "</br><b>Hello and Welcome !</b></br></br>" +
                    "</br>To complete your account verification, please use the One-Time Password (OTP) below:</br></br><b>Your OTP: "+otp+ "</b></br>" +
                    "</br>This OTP is valid for <b>5 minutes</b>. Please do not share it with anyone for security reasons.</br>" +
                    "</br>If you didn't request this, please ignore this email.";
            emailService.sendMail(req.getEmail(), "Verify your Account", body);
        }).start();
        User user=userMapper.dtoToEntity(req);
        if(req.getProfilePicture()!=null)
            user.setProfilePicture(fileService.saveFile(req.getProfilePicture()));
        user = userRepo.save(user);
        long userId = user.getId();
        if (req.getAddress() != null) {
            req.getAddress().parallelStream().forEach(address -> {
                address.setUserId(userId);
                addressService.saveAddress(address);
            });
        }
        return "Please check you email for OPT to verify your account and proceed further";
    }

    @Override
    public String activateAccount(OTPDto req) {
        if (otpMap.containsKey(req.getEmail())) {
            if (otpMap.get(req.getEmail()).equals(req.getOTP())) {
                User user=userRepo.findByEmail(req.getEmail()).orElseThrow(()->new CustomException("User not Found",HttpStatus.NOT_FOUND));
                user.setIsActive(true);
                userRepo.save(user);
                otpMap.remove(req.getEmail());
                return "Your account has been verified";
            }else throw new CustomException("Invalid OTP", HttpStatus.UNAUTHORIZED);
        } else throw new CustomException("OTP expired or not requested", HttpStatus.BAD_REQUEST);
    }

    @Override
    public LoginDto signIn(LoginDto req) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(req.getUsername(), req.getPassword()));
        final AuthenticatedUser userDetails = (AuthenticatedUser) userDetailsService.loadUserByUsername(req.getUsername());
        if (userDetails.isActive()) {
            SecurityContextHolder.getContext().setAuthentication(authentication);
            final String token = jwtUtil.generateToken(userDetails);
            return LoginDto.builder().token(token).build();
        } else {
            int otp = getOtp(userDetails.getUsername());
            String body = "Your one-time password (OTP) for activating your account is <b>" + otp + "</b>. This code will expire in 5 minutes. Please enter it promptly to complete your request.";
            emailService.sendMail(userDetails.getUsername(), "Account activation Request", body);
            throw new CustomException("Please check your email for OTP to activate your account", HttpStatus.FORBIDDEN);
        }
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
        Sort sort;
        if (sortDirection.equalsIgnoreCase("desc")) sort = Sort.by(sortBy).descending();
        else sort = Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);
        Page<User> users = userRepo.findAllPagewiseByIsActive(pageable, status);
        List<UserDto> res = users.stream().map(userMapper::entityToDto).collect(Collectors.toList());
        return PageWiseResDto.<UserDto>builder()
                .res(res)
                .totalPages(users.getTotalPages())
                .totalElements(users.getTotalElements())
                .currentPage(users.getNumber())
                .pageSize(users.getSize())
                .isLast(users.isLast())
                .build();
    }

    @Override
    public UserDto updateById(UserDto req) {
        User user = userRepo.findById(req.getId()).orElseThrow(() -> new CustomException("User Not Found", HttpStatus.NOT_FOUND));
        user.setFirstName(req.getFirstName());
        user.setMiddleName(req.getMiddleName());
        user.setLastName(req.getLastName());
        if (userRepo.findByEmail(req.getEmail()).isPresent())
            throw new CustomException("Email already registered", HttpStatus.BAD_REQUEST);
        user.setEmail(req.getEmail());
        user.setPhone(req.getPhone());
        user.setUpdatedDate(LocalDate.now());
        return userMapper.entityToDto(userRepo.save(user));
    }

    @Override
    public String forgotPassword(OTPDto req) {
        if (userRepo.findByEmail(req.getEmail()).isPresent()) {
            int otp = getOtp(req.getEmail());
            otpMap.put(req.getEmail(), otp);
            String body = "Your one-time password (OTP) for resetting your password is <b>" + otp + "</b>. This code will expire in 5 minutes. Please enter it promptly to complete your request.";
            emailService.sendMail(req.getEmail(), "Forgot Password Request", body);
        }
        return "Please check you email for OPT to change password";
    }

    @Override
    public OTPDto validateOTP(OTPDto req) {
        if (otpMap.containsKey(req.getEmail())) {
            if (otpMap.get(req.getEmail()).equals(req.getOTP())) {
                String token = "just_a_random_token";
                tokenMap.put(req.getEmail(), token);
                otpMap.remove(req.getEmail());
                return OTPDto.builder().token(token).build();
            } else throw new CustomException("Invalid OTP", HttpStatus.UNAUTHORIZED);
        } else throw new CustomException("OTP expired or not requested", HttpStatus.BAD_REQUEST);
    }

    @Override
    public String resetPassword(PasswordDto req) {
        if (tokenMap.containsKey(req.getEmail())) {
            if (tokenMap.get(req.getEmail()).equals(req.getToken())) {
                User user = userRepo.findByUsername(req.getEmail()).orElseThrow(() -> new CustomException("User not found", HttpStatus.NOT_FOUND));
                user.setPassword(new BCryptPasswordEncoder().encode(req.getNewPassword()));
                userRepo.save(user);
                tokenMap.remove(req.getEmail());
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
        otpMap.clear();
        log.info("OTP map cleared");
    }

    public static void clearTokenMap() {
        tokenMap.clear();
        log.info("Token map cleared");
    }

    private int getOtp(String email) {
        int otp = (int) (Math.pow(10, Integer.parseInt(optLength) - 1) + Math.random() * 9 * Math.pow(10, Integer.parseInt(optLength) - 1));
        otpMap.put(email, otp);
        return otp;
    }
}
