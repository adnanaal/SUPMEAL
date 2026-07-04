package supmeal_backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import supmeal_backend.dto.request.LoginRequest;
import supmeal_backend.dto.request.RegisterRequest;
import supmeal_backend.dto.response.AuthenticationResponse;
import supmeal_backend.dto.response.UserResponse;
import supmeal_backend.entity.User;
import supmeal_backend.mapper.UserMapper;
import supmeal_backend.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserService userService;
    private final UserMapper userMapper;

    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody RegisterRequest request) {
        if (userService.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().build();
        }
        User user = userMapper.toEntity(request);
        User savedUser = userService.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(userMapper.toResponse(savedUser));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthenticationResponse> login(@Valid @RequestBody LoginRequest request) {
        User user = userService.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        // Password verification should be done here with BCrypt
        // For now, return a simple authentication response
        AuthenticationResponse response = AuthenticationResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstname(user.getFirstname())
                .lastname(user.getLastname())
                .type("Bearer")
                .token("jwt-token-placeholder")
                .build();
        return ResponseEntity.ok(response);
    }
}
