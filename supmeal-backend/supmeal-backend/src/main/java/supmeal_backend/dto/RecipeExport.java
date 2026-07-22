package supmeal_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecipeExport {
    private Long id;
    private String title;
    private String description;
    private String imagePath;
    private Integer cookingTime;
    private Integer preparationTime;
    private Integer servings;
    private String mealType;
    private String source;
    private String sourceUrl;
    private List<IngredientExport> ingredients;
    private List<RecipeStepExport> steps;
    private List<String> tags;
}
