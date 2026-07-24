package supmeal_backend.auth.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import supmeal_backend.auth.service.AuthService;
import supmeal_backend.dto.request.ChangePasswordRequest;
import supmeal_backend.dto.request.LoginRequest;
import supmeal_backend.dto.request.RegisterRequest;
import supmeal_backend.dto.request.UserUpdateRequest;
import supmeal_backend.dto.response.AuthenticationResponse;
import supmeal_backend.dto.response.UserResponse;
import supmeal_backend.entity.User;
import supmeal_backend.mapper.UserMapper;
import supmeal_backend.service.UserService;
import org.springframework.security.crypto.password.PasswordEncoder;

import jakarta.validation.Valid;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;
    private final UserService userService;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            log.info("Registration attempt for email: {}", request.getEmail());
            UserResponse response = authService.register(request);
            log.info("Registration successful for email: {}", request.getEmail());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            log.error("Registration failed for email {}: {}", request.getEmail(), e.getMessage(), e);
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        try {
            log.info("Login attempt for email: {}", request.getEmail());
            AuthenticationResponse response = authService.login(request);
            log.info("Login successful for email: {}", request.getEmail());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            log.error("Login failed for email {}: {}", request.getEmail(), e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        try {
            Object principal = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            log.info("Principal type: {}", principal.getClass().getName());
            
            if (principal == null || principal instanceof String && "anonymousUser".equals(principal)) {
                log.warn("No authenticated user found");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No authenticated user");
            }
            
            User user;
            if (principal instanceof supmeal_backend.security.model.CustomUserDetails) {
                user = ((supmeal_backend.security.model.CustomUserDetails) principal).getUser();
            } else if (principal instanceof User) {
                user = (User) principal;
            } else {
                log.warn("Principal is not a CustomUserDetails or User instance: {}", principal.getClass().getName());
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid principal type");
            }
            
            log.info("Getting current user for email: {}", user.getEmail());
            return ResponseEntity.ok(userMapper.toResponse(user));
        } catch (Exception e) {
            log.error("Error getting current user: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@Valid @RequestBody UserUpdateRequest request) {
        try {
            Object principal = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            log.info("Principal type in updateProfile: {}", principal.getClass().getName());
            
            if (principal == null || principal instanceof String && "anonymousUser".equals(principal)) {
                log.warn("No authenticated user found for profile update");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No authenticated user");
            }
            
            User currentUser;
            if (principal instanceof supmeal_backend.security.model.CustomUserDetails) {
                currentUser = ((supmeal_backend.security.model.CustomUserDetails) principal).getUser();
            } else if (principal instanceof User) {
                currentUser = (User) principal;
            } else {
                log.warn("Principal is not a CustomUserDetails or User instance: {}", principal.getClass().getName());
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid principal type");
            }
            
            log.info("Updating profile for email: {}", currentUser.getEmail());
            log.info("Request data: firstname={}, lastname={}, email={}, avatar={}", 
                request.getFirstname(), request.getLastname(), request.getEmail(), request.getAvatar());
            
            // Fetch fresh user from database to avoid Hibernate issues
            User user = userService.findById(currentUser.getId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            if (request.getFirstname() != null) {
                user.setFirstname(request.getFirstname());
            }
            if (request.getLastname() != null) {
                user.setLastname(request.getLastname());
            }
            if (request.getEmail() != null) {
                user.setEmail(request.getEmail());
            }
            if (request.getAvatar() != null) {
                user.setAvatar(request.getAvatar());
            }
            if (request.getDietaryPreferences() != null) {
                user.setDietaryPreferences(request.getDietaryPreferences());
            }
            if (request.getAllergies() != null) {
                user.setAllergies(request.getAllergies());
            }
            if (request.getFavoriteCuisine() != null) {
                user.setFavoriteCuisine(request.getFavoriteCuisine());
            }
            if (request.getDefaultServings() != null) {
                user.setDefaultServings(request.getDefaultServings());
            }
            
            User updatedUser = userService.update(user);
            log.info("Profile updated successfully for email: {}", updatedUser.getEmail());
            return ResponseEntity.ok(userMapper.toResponse(updatedUser));
        } catch (Exception e) {
            log.error("Error updating profile: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        try {
            Object principal = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            log.info("Principal type in changePassword: {}", principal.getClass().getName());
            
            if (principal == null || principal instanceof String && "anonymousUser".equals(principal)) {
                log.warn("No authenticated user found for password change");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No authenticated user");
            }
            
            User currentUser;
            if (principal instanceof supmeal_backend.security.model.CustomUserDetails) {
                currentUser = ((supmeal_backend.security.model.CustomUserDetails) principal).getUser();
            } else if (principal instanceof User) {
                currentUser = (User) principal;
            } else {
                log.warn("Principal is not a CustomUserDetails or User instance: {}", principal.getClass().getName());
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid principal type");
            }
            
            log.info("Changing password for email: {}", currentUser.getEmail());
            
            // Fetch fresh user from database
            User user = userService.findById(currentUser.getId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            // Verify current password
            if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
                log.warn("Current password does not match for email: {}", currentUser.getEmail());
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Current password is incorrect");
            }
            
            // Update with new hashed password
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
            User updatedUser = userService.update(user);
            
            log.info("Password changed successfully for email: {}", updatedUser.getEmail());
            return ResponseEntity.ok("Password changed successfully");
        } catch (Exception e) {
            log.error("Error changing password: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }
}
