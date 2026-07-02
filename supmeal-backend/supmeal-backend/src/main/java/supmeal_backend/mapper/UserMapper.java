package supmeal_backend.dto.mapper;

import org.springframework.stereotype.Component;
import supmeal_backend.dto.UserDTO;
import supmeal_backend.entity.User;

@Component
public class UserMapper {

    public UserDTO toDTO(User user) {
        if (user == null) {
            return null;
        }
        return UserDTO.builder()
                .id(user.getId())
                .firstname(user.getFirstname())
                .lastname(user.getLastname())
                .email(user.getEmail())
                .avatar(user.getAvatar())
                .oauthProvider(user.getOauthProvider())
                .providerId(user.getProviderId())
                .isVerified(user.getIsVerified())
                .dietaryPreferences(user.getDietaryPreferences())
                .allergies(user.getAllergies())
                .favoriteCuisine(user.getFavoriteCuisine())
                .defaultServings(user.getDefaultServings())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }

    public User toEntity(UserDTO userDTO) {
        if (userDTO == null) {
            return null;
        }
        return User.builder()
                .id(userDTO.getId())
                .firstname(userDTO.getFirstname())
                .lastname(userDTO.getLastname())
                .email(userDTO.getEmail())
                .avatar(userDTO.getAvatar())
                .oauthProvider(userDTO.getOauthProvider())
                .providerId(userDTO.getProviderId())
                .isVerified(userDTO.getIsVerified())
                .dietaryPreferences(userDTO.getDietaryPreferences())
                .allergies(userDTO.getAllergies())
                .favoriteCuisine(userDTO.getFavoriteCuisine())
                .defaultServings(userDTO.getDefaultServings())
                .createdAt(userDTO.getCreatedAt())
                .updatedAt(userDTO.getUpdatedAt())
                .build();
    }
}
