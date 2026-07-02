package supmeal_backend.mapper;

import org.springframework.stereotype.Component;
import supmeal_backend.dto.FavoriteRecipeDTO;
import supmeal_backend.entity.FavoriteRecipe;

@Component
public class FavoriteRecipeMapper {

    public FavoriteRecipeDTO toDTO(FavoriteRecipe favoriteRecipe) {
        if (favoriteRecipe == null) {
            return null;
        }
        return FavoriteRecipeDTO.builder()
                .id(favoriteRecipe.getId())
                .createdAt(favoriteRecipe.getCreatedAt())
                .userId(favoriteRecipe.getUser() != null ? favoriteRecipe.getUser().getId() : null)
                .recipeId(favoriteRecipe.getRecipe() != null ? favoriteRecipe.getRecipe().getId() : null)
                .build();
    }

    public FavoriteRecipe toEntity(FavoriteRecipeDTO favoriteRecipeDTO) {
        if (favoriteRecipeDTO == null) {
            return null;
        }
        return FavoriteRecipe.builder()
                .id(favoriteRecipeDTO.getId())
                .createdAt(favoriteRecipeDTO.getCreatedAt())
                .build();
    }
}
