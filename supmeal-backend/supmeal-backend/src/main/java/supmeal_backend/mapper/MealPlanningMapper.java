package supmeal_backend.mapper;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import supmeal_backend.dto.request.MealPlanningCreateRequest;
import supmeal_backend.dto.request.MealPlanningUpdateRequest;
import supmeal_backend.dto.response.MealPlanningResponse;
import supmeal_backend.entity.MealPlanning;
import supmeal_backend.entity.Recipe;
import supmeal_backend.exception.ResourceNotFoundException;
import supmeal_backend.repository.RecipeRepository;

@Component
@RequiredArgsConstructor
public class MealPlanningMapper {

    private final RecipeRepository recipeRepository;

    public MealPlanningResponse toResponse(MealPlanning mealPlanning) {
        if (mealPlanning == null) {
            return null;
        }
        return MealPlanningResponse.builder()
                .id(mealPlanning.getId())
                .plannedDate(mealPlanning.getPlannedDate())
                .mealType(mealPlanning.getMealType())
                .createdAt(mealPlanning.getCreatedAt())
                .userId(mealPlanning.getUser() != null ? mealPlanning.getUser().getId() : null)
                .recipeId(mealPlanning.getRecipe() != null ? mealPlanning.getRecipe().getId() : null)
                .build();
    }

    public MealPlanning toEntity(MealPlanningCreateRequest request) {
        if (request == null) {
            return null;
        }
        MealPlanning mealPlanning = MealPlanning.builder()
                .plannedDate(request.getPlannedDate())
                .mealType(request.getMealType())
                .build();
        
        if (request.getRecipeId() != null) {
            Recipe recipe = recipeRepository.findById(request.getRecipeId())
                    .orElseThrow(() -> new ResourceNotFoundException(String.format("Recipe not found with id: %d", request.getRecipeId())));
            mealPlanning.setRecipe(recipe);
        }
        
        return mealPlanning;
    }

    public MealPlanning toEntity(MealPlanningUpdateRequest request) {
        if (request == null) {
            return null;
        }
        return MealPlanning.builder()
                .plannedDate(request.getPlannedDate())
                .mealType(request.getMealType())
                .build();
    }
}
