package supmeal_backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
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
public class RecipeCreateRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @Positive(message = "Preparation time must be positive")
    private Integer preparationTime;

    @Positive(message = "Cooking time must be positive")
    private Integer cookingTime;

    @Positive(message = "Servings must be positive")
    private Integer servings;

    private String imagePath;

    private String source;

    @NotNull(message = "Meal type is required")
    private MealType mealType;

    private List<String> ingredients;

    private List<String> steps;

    private List<String> tags;
}
