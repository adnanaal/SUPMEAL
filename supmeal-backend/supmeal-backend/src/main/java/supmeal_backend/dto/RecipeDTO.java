package supmeal_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import supmeal_backend.entity.enums.MealType;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecipeDTO {
    private Long id;
    private String title;
    private String description;
    private Integer preparationTime;
    private Integer cookingTime;
    private Integer servings;
    private String imagePath;
    private String source;
    private MealType mealType;
    private Long ownerId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<IngredientDTO> ingredients;
    private List<RecipeStepDTO> steps;
    private List<TagDTO> tags;
}
