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
public class FavoriteRecipeDTO {
    private Long id;
    private LocalDateTime createdAt;
    private Long userId;
    private Long recipeId;
}
