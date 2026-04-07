package com.busbooking.service;

import com.busbooking.dto.request.LoginRequest;
import com.busbooking.dto.request.RegisterRequest;
import com.busbooking.dto.response.AuthResponse;
import com.busbooking.dto.response.UserResponse;
import com.busbooking.entity.User;
import com.busbooking.entity.enums.Role;
import com.busbooking.exception.BadRequestException;
import com.busbooking.exception.InvalidCredentialsException;
import com.busbooking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthResponse register(RegisterRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmailIgnoreCase(normalizedEmail)) {
            logger.warn("Registration failed because email {} already exists.", normalizedEmail);
            throw new BadRequestException("Email is already registered.");
        }

        Role role = request.getRole() == null ? Role.USER : request.getRole();

        User user = User.builder()
                .name(request.getName().trim())
                .email(normalizedEmail)
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .build();

        User savedUser = userRepository.save(user);
        logger.info("User registered successfully with email {}", savedUser.getEmail());

        return AuthResponse.builder()
                .message("User registered successfully.")
                .user(mapToUserResponse(savedUser))
                .build();
    }

    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        String normalizedEmail = request.getEmail().trim().toLowerCase();

        User user = userRepository.findByEmailIgnoreCase(normalizedEmail)
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            logger.warn("Login failed for email {}", normalizedEmail);
            throw new InvalidCredentialsException("Invalid email or password.");
        }

        logger.info("User logged in successfully with email {}", user.getEmail());
        return AuthResponse.builder()
                .message("Login successful.")
                .user(mapToUserResponse(user))
                .build();
    }

    private UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }
}
