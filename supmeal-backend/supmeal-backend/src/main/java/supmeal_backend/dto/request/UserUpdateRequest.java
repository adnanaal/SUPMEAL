package supmeal_backend.dto.request;

import jakarta.validation.constraints.Email;
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

    @Email(message = "Email should be valid")
    private String email;

    private String avatar;

    private String dietaryPreferences;

    private String allergies;

    private String favoriteCuisine;

    @Positive(message = "Default servings must be positive")
    private Integer defaultServings;
}
