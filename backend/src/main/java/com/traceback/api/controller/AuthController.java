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

import java.time.LocalDateTime;
import java.util.Map;

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

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest, HttpServletRequest request) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            ErrorResponse error = new ErrorResponse();
            error.setTimestamp(LocalDateTime.now());
            error.setStatus(HttpStatus.CONFLICT.value());
            error.setError(HttpStatus.CONFLICT.getReasonPhrase());
            error.setMessage("Email already in use");
            error.setPath(request.getRequestURI());
            return new ResponseEntity<>(error, HttpStatus.CONFLICT);
        }

        User user = new User();
        user.setName(registerRequest.getName());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        
        // As per spec: Registration always forcefully provisions a STUDENT role.
        user.setRole(Role.STUDENT);

        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "User registered successfully"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody AuthRequest authRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        authRequest.getEmail(),
                        authRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = tokenProvider.generateToken(authentication);
        User user = userRepository.findByEmail(authRequest.getEmail()).orElseThrow();

        AuthResponse.UserDto userDto = new AuthResponse.UserDto(
                user.getId(),
                user.getName(),
                user.getRole().name()
        );

        return ResponseEntity.ok(new AuthResponse(jwt, userDto));
    }
}
