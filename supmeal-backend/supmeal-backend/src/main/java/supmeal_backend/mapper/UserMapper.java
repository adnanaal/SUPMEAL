package supmeal_backend.mapper;

import org.springframework.stereotype.Component;
import supmeal_backend.dto.request.RegisterRequest;
import supmeal_backend.dto.request.UserCreateRequest;
import supmeal_backend.dto.request.UserUpdateRequest;
import supmeal_backend.dto.response.UserResponse;
import supmeal_backend.entity.User;

@Component
public class UserMapper {

    public UserResponse toResponse(User user) {
        if (user == null) {
            return null;
        }
        return UserResponse.builder()
                .id(user.getId())
                .firstname(user.getFirstname())
                .lastname(user.getLastname())
                .email(user.getEmail())
                .avatar(user.getAvatar())
                .isVerified(user.getIsVerified())
                .dietaryPreferences(user.getDietaryPreferences())
                .allergies(user.getAllergies())
                .favoriteCuisine(user.getFavoriteCuisine())
                .defaultServings(user.getDefaultServings())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }

    public User toEntity(UserCreateRequest request) {
        if (request == null) {
            return null;
        }
        return User.builder()
                .firstname(request.getFirstname())
                .lastname(request.getLastname())
                .email(request.getEmail())
                .password(request.getPassword())
                .avatar(request.getAvatar())
                .dietaryPreferences(request.getDietaryPreferences())
                .allergies(request.getAllergies())
                .favoriteCuisine(request.getFavoriteCuisine())
                .defaultServings(request.getDefaultServings())
                .build();
    }

    public User toEntity(UserUpdateRequest request) {
        if (request == null) {
            return null;
        }
        return User.builder()
                .firstname(request.getFirstname())
                .lastname(request.getLastname())
                .email(request.getEmail())
                .avatar(request.getAvatar())
                .dietaryPreferences(request.getDietaryPreferences())
                .allergies(request.getAllergies())
                .favoriteCuisine(request.getFavoriteCuisine())
                .defaultServings(request.getDefaultServings())
                .build();
    }

    public User toEntity(RegisterRequest request) {
        if (request == null) {
            return null;
        }
        return User.builder()
                .firstname(request.getFirstname())
                .lastname(request.getLastname())
                .email(request.getEmail())
                .password(request.getPassword())
                .avatar(request.getAvatar())
                .dietaryPreferences(request.getDietaryPreferences())
                .allergies(request.getAllergies())
                .favoriteCuisine(request.getFavoriteCuisine())
                .defaultServings(request.getDefaultServings())
                .build();
    }
}
