package supmeal_backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import supmeal_backend.dto.request.UserCreateRequest;
import supmeal_backend.dto.request.UserUpdateRequest;
import supmeal_backend.dto.response.UserResponse;
import supmeal_backend.entity.User;
import supmeal_backend.exception.AlreadyExistsException;
import supmeal_backend.exception.ResourceNotFoundException;
import supmeal_backend.mapper.UserMapper;
import supmeal_backend.service.UserService;

import jakarta.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @PostMapping
    public ResponseEntity<UserResponse> createUser(@Valid @RequestBody UserCreateRequest request) {
        if (userService.existsByEmail(request.getEmail())) {
            throw new AlreadyExistsException(String.format("Email already exists: %s", request.getEmail()));
        }
        User user = userMapper.toEntity(request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        User savedUser = userService.save(user);
        return new ResponseEntity<>(userMapper.toResponse(savedUser), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        List<User> users = userService.findAll();
        List<UserResponse> responses = users.stream()
                .map(userMapper::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        User user = userService.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("User not found with id: %d", id)));
        return ResponseEntity.ok(userMapper.toResponse(user));
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<UserResponse> getUserByEmail(@PathVariable String email) {
        User user = userService.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("User not found with email: %s", email)));
        return ResponseEntity.ok(userMapper.toResponse(user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> updateUser(@PathVariable Long id, @Valid @RequestBody UserUpdateRequest request) {
        User existingUser = userService.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("User not found with id: %d", id)));
        
        if (request.getFirstname() != null) {
            existingUser.setFirstname(request.getFirstname());
        }
        if (request.getLastname() != null) {
            existingUser.setLastname(request.getLastname());
        }
        if (request.getPassword() != null) {
            existingUser.setPassword(request.getPassword());
        }
        if (request.getAvatar() != null) {
            existingUser.setAvatar(request.getAvatar());
        }
        if (request.getDietaryPreferences() != null) {
            existingUser.setDietaryPreferences(request.getDietaryPreferences());
        }
        if (request.getAllergies() != null) {
            existingUser.setAllergies(request.getAllergies());
        }
        if (request.getFavoriteCuisine() != null) {
            existingUser.setFavoriteCuisine(request.getFavoriteCuisine());
        }
        if (request.getDefaultServings() != null) {
            existingUser.setDefaultServings(request.getDefaultServings());
        }
        
        User updatedUser = userService.update(existingUser);
        return ResponseEntity.ok(userMapper.toResponse(updatedUser));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        User user = userService.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("User not found with id: %d", id)));
        userService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
