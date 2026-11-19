package com.traceback.api.controller;

import com.traceback.api.dto.AuthRequest;
import com.traceback.api.dto.AuthResponse;
import com.traceback.api.dto.RegisterRequest;
import com.traceback.api.exception.ErrorResponse;
import com.traceback.api.model.Role;
import com.traceback.api.model.User;
import com.traceback.api.repository.UserRepository;
import com.traceback.api.security.JwtTokenProvider;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirements;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Authentication & Identity Controller for TraceBack Campus Recovery Network.
 * Handles public student account registration and JWT credential issuance.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthController(AuthenticationManager authenticationManager, UserRepository userRepository,
                          PasswordEncoder passwordEncoder, JwtTokenProvider tokenProvider) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    /**
     * Registers a new verified student account in the campus database.
     * Enforces salted BCrypt password hashing and provisions a STUDENT role.
     * Returns 409 Conflict if the email already exists in the system.
     */
    @PostMapping("/register")
    @Operation(summary = "Register a new student user")
    @SecurityRequirements // Public endpoint - bypasses JWT authorization filter
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest, HttpServletRequest request) {
        // Prevent duplicate account registrations
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            ErrorResponse error = new ErrorResponse();
            error.setTimestamp(LocalDateTime.now());
            error.setStatus(HttpStatus.CONFLICT.value());
            error.setError(HttpStatus.CONFLICT.getReasonPhrase());
            error.setMessage("Email already in use");
            error.setPath(request.getRequestURI());
            return new ResponseEntity<>(error, HttpStatus.CONFLICT);
        }

        // Initialize user entity with BCrypt-hashed password
        User user = new User();
        user.setName(registerRequest.getName());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        
        // Institutional policy: Self-registration always provisions STUDENT role.
        // Security and Admin staff must be provisioned via the Admin Console.
        user.setRole(Role.STUDENT);

        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "User registered successfully"));
    }

    /**
     * Authenticates student/staff credentials and returns a signed HS256 JWT bearer token.
     */
    @PostMapping("/login")
    @Operation(summary = "Authenticate a user and get JWT")
    @SecurityRequirements // Public endpoint - bypasses JWT authorization filter
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody AuthRequest authRequest) {
        // Authenticate credentials against CustomUserDetailsService using BCrypt
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        authRequest.getEmail(),
                        authRequest.getPassword()
                )
        );

        // Bind authentication to current Spring SecurityContext
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Issue cryptographically signed JWT token with claims
        String jwt = tokenProvider.generateToken(authentication);
        User user = userRepository.findByEmail(authRequest.getEmail()).orElseThrow();

        // Return user metadata and bearer token to client
        AuthResponse.UserDto userDto = new AuthResponse.UserDto(
                user.getId(),
                user.getName(),
                user.getRole().name()
        );

        return ResponseEntity.ok(new AuthResponse(jwt, userDto));
    }
}
