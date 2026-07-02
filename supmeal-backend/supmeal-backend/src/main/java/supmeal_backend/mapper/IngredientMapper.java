package supmeal_backend.mapper;

import org.springframework.stereotype.Component;
import supmeal_backend.dto.IngredientDTO;
import supmeal_backend.entity.Ingredient;

@Component
public class IngredientMapper {

    public IngredientDTO toDTO(Ingredient ingredient) {
        if (ingredient == null) {
            return null;
        }
        return IngredientDTO.builder()
                .id(ingredient.getId())
                .name(ingredient.getName())
                .quantity(ingredient.getQuantity())
                .unit(ingredient.getUnit())
                .recipeId(ingredient.getRecipe() != null ? ingredient.getRecipe().getId() : null)
                .build();
    }

    public Ingredient toEntity(IngredientDTO ingredientDTO) {
        if (ingredientDTO == null) {
            return null;
        }
        return Ingredient.builder()
                .id(ingredientDTO.getId())
                .name(ingredientDTO.getName())
                .quantity(ingredientDTO.getQuantity())
                .unit(ingredientDTO.getUnit())
                .build();
    }
}
