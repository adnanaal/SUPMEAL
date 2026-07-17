package supmeal_backend.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import supmeal_backend.entity.enums.MealType;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecipeUpdateRequest {

    private String title;

    private String description;

    @Positive(message = "Preparation time must be positive")
    private Integer preparationTime;

    @Min(value = 0, message = "Cooking time must be 0 or positive")
    private Integer cookingTime;

    @Positive(message = "Servings must be positive")
    private Integer servings;

    private String imagePath;

    private String source;

    private MealType mealType;

    private List<String> ingredients;

    private List<String> steps;

    private List<String> tags;
}
