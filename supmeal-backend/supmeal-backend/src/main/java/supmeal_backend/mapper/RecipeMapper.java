package supmeal_backend.mapper;

import org.springframework.stereotype.Component;
import supmeal_backend.dto.IngredientDTO;
import supmeal_backend.dto.RecipeDTO;
import supmeal_backend.dto.RecipeStepDTO;
import supmeal_backend.dto.TagDTO;
import supmeal_backend.entity.Ingredient;
import supmeal_backend.entity.Recipe;
import supmeal_backend.entity.RecipeStep;
import supmeal_backend.entity.Tag;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class RecipeMapper {

    private final IngredientMapper ingredientMapper;
    private final RecipeStepMapper recipeStepMapper;
    private final TagMapper tagMapper;

    public RecipeMapper(IngredientMapper ingredientMapper, RecipeStepMapper recipeStepMapper, TagMapper tagMapper) {
        this.ingredientMapper = ingredientMapper;
        this.recipeStepMapper = recipeStepMapper;
        this.tagMapper = tagMapper;
    }

    public RecipeDTO toDTO(Recipe recipe) {
        if (recipe == null) {
            return null;
        }
        List<IngredientDTO> ingredientDTOs = recipe.getIngredients() != null
                ? recipe.getIngredients().stream().map(ingredientMapper::toDTO).collect(Collectors.toList())
                : List.of();
        List<RecipeStepDTO> recipeStepDTOs = recipe.getSteps() != null
                ? recipe.getSteps().stream().map(recipeStepMapper::toDTO).collect(Collectors.toList())
                : List.of();
        List<TagDTO> tagDTOs = recipe.getTags() != null
                ? recipe.getTags().stream().map(tagMapper::toDTO).collect(Collectors.toList())
                : List.of();

        return RecipeDTO.builder()
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
                .ingredients(ingredientDTOs)
                .steps(recipeStepDTOs)
                .tags(tagDTOs)
                .build();
    }

    public Recipe toEntity(RecipeDTO recipeDTO) {
        if (recipeDTO == null) {
            return null;
        }
        List<Ingredient> ingredients = recipeDTO.getIngredients() != null
                ? recipeDTO.getIngredients().stream().map(ingredientMapper::toEntity).collect(Collectors.toList())
                : List.of();
        List<RecipeStep> steps = recipeDTO.getSteps() != null
                ? recipeDTO.getSteps().stream().map(recipeStepMapper::toEntity).collect(Collectors.toList())
                : List.of();
        List<Tag> tags = recipeDTO.getTags() != null
                ? recipeDTO.getTags().stream().map(tagMapper::toEntity).collect(Collectors.toList())
                : List.of();

        return Recipe.builder()
                .id(recipeDTO.getId())
                .title(recipeDTO.getTitle())
                .description(recipeDTO.getDescription())
                .preparationTime(recipeDTO.getPreparationTime())
                .cookingTime(recipeDTO.getCookingTime())
                .servings(recipeDTO.getServings())
                .imagePath(recipeDTO.getImagePath())
                .source(recipeDTO.getSource())
                .mealType(recipeDTO.getMealType())
                .createdAt(recipeDTO.getCreatedAt())
                .updatedAt(recipeDTO.getUpdatedAt())
                .ingredients(ingredients)
                .steps(steps)
                .tags(tags)
                .build();
    }
}
