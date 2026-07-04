package supmeal_backend.mapper;

import org.springframework.stereotype.Component;
import supmeal_backend.dto.request.MealPlanningCreateRequest;
import supmeal_backend.dto.request.MealPlanningUpdateRequest;
import supmeal_backend.dto.response.MealPlanningResponse;
import supmeal_backend.entity.MealPlanning;

@Component
public class MealPlanningMapper {

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
        return MealPlanning.builder()
                .plannedDate(request.getPlannedDate())
                .mealType(request.getMealType())
                .build();
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
