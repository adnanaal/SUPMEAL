package supmeal_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserData {
    private Long id;
    private String email;
    private String firstname;
    private String lastname;
    private String avatar;
    private String dietaryPreferences;
    private String allergies;
    private String favoriteCuisine;
    private Integer defaultServings;
}
