package supmeal_backend.mapper;

import org.springframework.stereotype.Component;
import supmeal_backend.dto.request.RecipeCreateRequest;
import supmeal_backend.dto.request.RecipeUpdateRequest;
import supmeal_backend.dto.response.RecipeResponse;
import supmeal_backend.entity.Recipe;

@Component
public class RecipeMapper {

    public RecipeResponse toResponse(Recipe recipe) {
        if (recipe == null) {
            return null;
        }
        return RecipeResponse.builder()
                .id(recipe.getId())
                .title(recipe.getTitle())
                .description(recipe.getDescription())
                .preparationTime(recipe.getPreparationTime())
                .cookingTime(recipe.getCookingTime())
                .servings(recipe.getServings())
                .imagePath(recipe.getImagePath())
                .source(recipe.getSource())
                .mealType(recipe.getMealType())
                .ownerId(recipe.getOwner() != null ? recipe.getOwner().getId() : null)
                .createdAt(recipe.getCreatedAt())
                .updatedAt(recipe.getUpdatedAt())
                .ingredients(recipe.getIngredients() != null 
                    ? recipe.getIngredients().stream().map(i -> i.getName()).toList() 
                    : null)
                .steps(recipe.getSteps() != null 
                    ? recipe.getSteps().stream().map(s -> s.getInstruction()).toList() 
                    : null)
                .tags(recipe.getTags() != null 
                    ? recipe.getTags().stream().map(t -> t.getName()).toList() 
                    : null)
                .build();
    }

    public Recipe toEntity(RecipeCreateRequest request) {
        if (request == null) {
            return null;
        }
        return Recipe.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .preparationTime(request.getPreparationTime())
                .cookingTime(request.getCookingTime())
                .servings(request.getServings())
                .imagePath(request.getImagePath())
                .source(request.getSource())
                .mealType(request.getMealType())
                .build();
    }

    public Recipe toEntity(RecipeUpdateRequest request) {
        if (request == null) {
            return null;
        }
        return Recipe.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .preparationTime(request.getPreparationTime())
                .cookingTime(request.getCookingTime())
                .servings(request.getServings())
                .imagePath(request.getImagePath())
                .source(request.getSource())
                .mealType(request.getMealType())
                .build();
    }
}
