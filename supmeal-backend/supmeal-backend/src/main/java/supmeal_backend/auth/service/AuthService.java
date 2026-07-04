package supmeal_backend.auth.service;

import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import supmeal_backend.dto.request.LoginRequest;
import supmeal_backend.dto.request.RegisterRequest;
import supmeal_backend.dto.response.AuthenticationResponse;
import supmeal_backend.dto.response.UserResponse;
import supmeal_backend.entity.User;
import supmeal_backend.mapper.UserMapper;
import supmeal_backend.security.jwt.JwtService;
import supmeal_backend.security.model.CustomUserDetails;
import supmeal_backend.service.UserService;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserService userService;
    private final UserMapper userMapper;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public UserResponse register(RegisterRequest request) {
        if (userService.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        User user = userMapper.toEntity(request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        User savedUser = userService.save(user);
        return userMapper.toResponse(savedUser);
    }

    public AuthenticationResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userService.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        UserDetails userDetails = new CustomUserDetails(user);
        String jwtToken = jwtService.generateToken(userDetails);
        
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .type("Bearer")
                .id(user.getId())
                .email(user.getEmail())
                .firstname(user.getFirstname())
                .lastname(user.getLastname())
                .build();
    }
}
