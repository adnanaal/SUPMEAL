package supmeal_backend.mapper;

import org.springframework.stereotype.Component;
import supmeal_backend.dto.request.FavoriteRecipeCreateRequest;
import supmeal_backend.dto.response.FavoriteRecipeResponse;
import supmeal_backend.entity.FavoriteRecipe;

@Component
public class FavoriteRecipeMapper {

    public FavoriteRecipeResponse toResponse(FavoriteRecipe favoriteRecipe) {
        if (favoriteRecipe == null) {
            return null;
        }
        return FavoriteRecipeResponse.builder()
                .id(favoriteRecipe.getId())
                .createdAt(favoriteRecipe.getCreatedAt())
                .userId(favoriteRecipe.getUser() != null ? favoriteRecipe.getUser().getId() : null)
                .recipeId(favoriteRecipe.getRecipe() != null ? favoriteRecipe.getRecipe().getId() : null)
                .build();
    }

    public FavoriteRecipe toEntity(FavoriteRecipeCreateRequest request) {
        if (request == null) {
            return null;
        }
        return FavoriteRecipe.builder()
                .build();
    }
}
