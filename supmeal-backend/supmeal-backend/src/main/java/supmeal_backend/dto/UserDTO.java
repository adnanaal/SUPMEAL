package supmeal_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Long id;
    private String firstname;
    private String lastname;
    private String email;
    private String avatar;
    private String oauthProvider;
    private String providerId;
    private Boolean isVerified;
    private String dietaryPreferences;
    private String allergies;
    private String favoriteCuisine;
    private Integer defaultServings;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
