package supmeal_backend.dto.mapper;

import org.springframework.stereotype.Component;
import supmeal_backend.dto.RecipeStepDTO;
import supmeal_backend.entity.RecipeStep;

@Component
public class RecipeStepMapper {

    public RecipeStepDTO toDTO(RecipeStep recipeStep) {
        if (recipeStep == null) {
            return null;
        }
        return RecipeStepDTO.builder()
                .id(recipeStep.getId())
                .stepOrder(recipeStep.getStepOrder())
                .instruction(recipeStep.getInstruction())
                .recipeId(recipeStep.getRecipe() != null ? recipeStep.getRecipe().getId() : null)
                .build();
    }

    public RecipeStep toEntity(RecipeStepDTO recipeStepDTO) {
        if (recipeStepDTO == null) {
            return null;
        }
        return RecipeStep.builder()
                .id(recipeStepDTO.getId())
                .stepOrder(recipeStepDTO.getStepOrder())
                .instruction(recipeStepDTO.getInstruction())
                .build();
    }
}
