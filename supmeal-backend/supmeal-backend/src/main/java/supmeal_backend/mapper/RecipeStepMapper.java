package supmeal_backend.mapper;

import org.springframework.stereotype.Component;
import supmeal_backend.dto.request.RecipeStepCreateRequest;
import supmeal_backend.dto.request.RecipeStepUpdateRequest;
import supmeal_backend.dto.response.RecipeStepResponse;
import supmeal_backend.entity.RecipeStep;

@Component
public class RecipeStepMapper {

    public RecipeStepResponse toResponse(RecipeStep recipeStep) {
        if (recipeStep == null) {
            return null;
        }
        return RecipeStepResponse.builder()
                .id(recipeStep.getId())
                .stepOrder(recipeStep.getStepOrder())
                .instruction(recipeStep.getInstruction())
                .recipeId(recipeStep.getRecipe() != null ? recipeStep.getRecipe().getId() : null)
                .build();
    }

    public RecipeStep toEntity(RecipeStepCreateRequest request) {
        if (request == null) {
            return null;
        }
        return RecipeStep.builder()
                .stepOrder(request.getStepOrder())
                .instruction(request.getInstruction())
                .build();
    }

    public RecipeStep toEntity(RecipeStepUpdateRequest request) {
        if (request == null) {
            return null;
        }
        return RecipeStep.builder()
                .stepOrder(request.getStepOrder())
                .instruction(request.getInstruction())
                .build();
    }
}
