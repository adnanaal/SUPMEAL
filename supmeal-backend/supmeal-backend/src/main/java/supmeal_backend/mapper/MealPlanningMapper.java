package supmeal_backend.dto.mapper;

import org.springframework.stereotype.Component;
import supmeal_backend.dto.MealPlanningDTO;
import supmeal_backend.entity.MealPlanning;

@Component
public class MealPlanningMapper {

    public MealPlanningDTO toDTO(MealPlanning mealPlanning) {
        if (mealPlanning == null) {
            return null;
        }
        return MealPlanningDTO.builder()
                .id(mealPlanning.getId())
                .plannedDate(mealPlanning.getPlannedDate())
                .mealType(mealPlanning.getMealType())
                .createdAt(mealPlanning.getCreatedAt())
                .userId(mealPlanning.getUser() != null ? mealPlanning.getUser().getId() : null)
                .recipeId(mealPlanning.getRecipe() != null ? mealPlanning.getRecipe().getId() : null)
                .build();
    }

    public MealPlanning toEntity(MealPlanningDTO mealPlanningDTO) {
        if (mealPlanningDTO == null) {
            return null;
        }
        return MealPlanning.builder()
                .id(mealPlanningDTO.getId())
                .plannedDate(mealPlanningDTO.getPlannedDate())
                .mealType(mealPlanningDTO.getMealType())
                .createdAt(mealPlanningDTO.getCreatedAt())
                .build();
    }
}
