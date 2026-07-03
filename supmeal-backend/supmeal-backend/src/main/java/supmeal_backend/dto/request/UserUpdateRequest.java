package supmeal_backend.dto.request;

import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserUpdateRequest {

    private String firstname;

    private String lastname;

    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;

    private String avatar;

    private String dietaryPreferences;

    private String allergies;

    private String favoriteCuisine;

    @Positive(message = "Default servings must be positive")
    private Integer defaultServings;
}
