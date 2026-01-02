package library.services.impl;

import library.config.jwt.JwtUtil;
import library.config.security.AuthenticatedUser;
import library.config.security.AuthenticationFacade;
import library.dto.*;
import library.services.AddressService;
import library.services.FileService;
import library.utils.OtpService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import library.exception.CustomException;
import library.models.User;
import library.repository.UserRepo;
import library.services.UserService;
import library.services.mappers.UserMapper;
import library.utils.EmailService;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserRepo userRepo;
    private final UserMapper userMapper;
    private final OtpService otpService;
    private final AddressService addressService;
    private final EmailService emailService;
    private final FileService fileService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;
    private final AuthenticationFacade facade;
    private final PasswordEncoder encoder;

    private static final Map<String, String> tokenMap = new HashMap<>();

    @Override
    public String signUp(UserDto req) {
        if (userRepo.findByEmail(req.getEmail()).isPresent())
            throw new CustomException("Email already registered. Please use a different email address or log in.", 409);
        if (!req.getPassword().equals(req.getConfirmPassword()))
            throw new CustomException("Confirm Password and Password must be same", 400);
        User user = userMapper.dtoToEntity(req);
        user = userRepo.save(user);
        new Thread(() -> {
            String otp = otpService.generateOtp(req.getEmail());
            String body = "<b>Dear " + req.getFirstName() + ",</b></br>" +
                    "</br><b>Hello and Welcome !</b></br></br>" +
                    "</br>To complete your account verification, please use the One-Time Password (OTP) below:</br></br><b>Your OTP: " + otp +
                    "</b></br>" + "</br>This OTP is valid for <b>5 minutes</b>. Please do not share it with anyone for security reasons.</br>" +
                    "</br>If you didn't request this, please ignore this email.";
            emailService.sendMail(req.getEmail(), "Verify your Account", body);
        }).start();
        long userId = user.getId();
        if (req.getAddress() != null) {
            req.getAddress().parallelStream().forEach(address -> {
                address.setUserId(userId);
                addressService.saveAddress(address);
            });
        }
        log.info("User created successfully");
        return "Please check you email for OPT to verify your account and proceed further";
    }

    @Override
    public String activateAccount(OTPDto req) {
        if (otpService.validateOtp(req.getIdentifier(), req.getOTP())) {
            User user = userRepo.findByEmail(req.getIdentifier()).orElseThrow(() -> new CustomException("User not Found", HttpStatus.NOT_FOUND));
            user.setIsActive(true);
            userRepo.save(user);
            return "Your account has been verified. Please log in.";
        } else {
            new Thread(() -> {
                String otp = otpService.generateOtp(req.getIdentifier());
                String body = "<b>Dear User,</b></br>" +
                        "</br><b>Welcome !</b></br></br>" +
                        "</br>To complete your account verification, please use the One-Time Password (OTP) below:</br></br><b>Your OTP: " + otp +
                        "</b></br>" + "</br>This OTP is valid for <b>5 minutes</b>. Please do not share it with anyone for security reasons.</br>" +
                        "</br>If you didn't request this, please ignore this email.";
                emailService.sendMail(req.getIdentifier(), "Verify your Account", body);
            }).start();
            return "Your OTP has already expired, please check your mail for new OTP";
        }
    }

    @Override
    public Object signIn(LoginDto req) {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(req.getUsername(), req.getPassword()));
        final AuthenticatedUser userDetails = (AuthenticatedUser) userDetailsService.loadUserByUsername(req.getUsername());
        if (userDetails.isActive()) {
            SecurityContextHolder.getContext().setAuthentication(authentication);
            final String token = jwtUtil.generateToken(userDetails);
            return Map.of("token", token);
        } else {
            String otp = otpService.generateOtp(userDetails.getUsername());
            String body = "Your one-time password (OTP) for activating your account is <b>" + otp +
                    "</b>. This code will expire in 5 minutes. Please enter it promptly to complete your request.";
            emailService.sendMail(userDetails.getUsername(), "Account activation Request", body);
            throw new CustomException("Please check your email for OTP to activate your account", HttpStatus.FORBIDDEN);
        }
    }

    @Override
    public String addProfilePicture(Long userId, MultipartFile profilePicture) {
        String filename = fileService.saveFile(profilePicture);
        return userRepo.findById(userId).map(u -> {
            u.setProfilePicture(filename);
            userRepo.save(u);
            return "Profile Picture Added";
        }).orElseThrow(() -> new CustomException("User Not Found", HttpStatus.NOT_FOUND));
    }

    @Override
    public UserDto getProfile() {
        User user= userRepo.findById(facade.getAuthentication().getUserId()).orElseThrow(()->new CustomException("User not found"));
        return userMapper.entityToDto(user);
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
        return PageWiseResDto.<UserDto>builder().res(res).totalPages(users.getTotalPages()).totalElements(users.getTotalElements()).currentPage(users.getNumber()).pageSize(users.getSize()).isLast(users.isLast()).build();
    }

    @Override
    public UserDto updateProfile(UserDto req) {
        if(!Objects.equals(req.getId(), facade.getAuthentication().getUserId()))
            throw new CustomException("Invalid request");
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
        if (userRepo.findByEmail(req.getIdentifier()).isPresent()) {
            String otp = otpService.generateOtp(req.getIdentifier());
            String body = "Your one-time password (OTP) for resetting your password is <b>" + otp +
                    "</b>. This code will expire in 5 minutes. Please enter it promptly to complete your request.";
            emailService.sendMail(req.getIdentifier(), "Forgot Password Request", body);
        }
        return "Please check you email for OPT to change password";
    }

    @Override
    public OTPDto validateOTP(OTPDto req) {
        if(otpService.validateOtp(req.getIdentifier(),req.getOTP())){
            tokenMap.put(req.getIdentifier(), req.getIdentifier());
            return OTPDto.builder().identifier(req.getIdentifier()).build();
        }else throw new CustomException("OTP expired or not requested", HttpStatus.BAD_REQUEST);
    }

    @Override
    public String resetPassword(PasswordDto req) {
        if (tokenMap.containsKey(req.getIdentifier())) {
                User user = userRepo.findByUsername(req.getIdentifier()).orElseThrow(() -> new CustomException("User not found", HttpStatus.NOT_FOUND));
                user.setPassword(new BCryptPasswordEncoder().encode(req.getNewPassword()));
                userRepo.save(user);
                tokenMap.remove(req.getIdentifier());
                return "Password changed successfully";
        } else throw new CustomException("Invalid request", HttpStatus.BAD_REQUEST);
    }

    @Override
    public String updatePassword(PasswordDto req) {
        if (req.getOldPassword() != null && !req.getOldPassword().isEmpty()) {
            long userId = facade.getAuthentication().getUserId();
            return userRepo.findById(userId).map(u -> {
                if (encoder.matches(req.getOldPassword(), u.getPassword())) {
                    u.setPassword(encoder.encode(req.getNewPassword()));
                    userRepo.save(u);
                    return "Password successfully updated";
                } else throw new CustomException("Incorrect old password", HttpStatus.BAD_REQUEST);
            }).orElseThrow(() -> new CustomException("User not found", HttpStatus.NOT_FOUND));
        } else throw new CustomException("Invalid Request", HttpStatus.BAD_REQUEST);
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

}
