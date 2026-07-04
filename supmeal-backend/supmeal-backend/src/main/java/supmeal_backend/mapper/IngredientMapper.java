package supmeal_backend.mapper;

import org.springframework.stereotype.Component;
import supmeal_backend.dto.request.IngredientCreateRequest;
import supmeal_backend.dto.request.IngredientUpdateRequest;
import supmeal_backend.dto.response.IngredientResponse;
import supmeal_backend.entity.Ingredient;

@Component
public class IngredientMapper {

    public IngredientResponse toResponse(Ingredient ingredient) {
        if (ingredient == null) {
            return null;
        }
        return IngredientResponse.builder()
                .id(ingredient.getId())
                .name(ingredient.getName())
                .quantity(ingredient.getQuantity())
                .unit(ingredient.getUnit())
                .recipeId(ingredient.getRecipe() != null ? ingredient.getRecipe().getId() : null)
                .build();
    }

    public Ingredient toEntity(IngredientCreateRequest request) {
        if (request == null) {
            return null;
        }
        return Ingredient.builder()
                .name(request.getName())
                .quantity(request.getQuantity())
                .unit(request.getUnit())
                .build();
    }

    public Ingredient toEntity(IngredientUpdateRequest request) {
        if (request == null) {
            return null;
        }
        return Ingredient.builder()
                .name(request.getName())
                .quantity(request.getQuantity())
                .unit(request.getUnit())
                .build();
    }
}
