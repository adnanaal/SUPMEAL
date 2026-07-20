package supmeal_backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import supmeal_backend.dto.request.FavoriteRecipeCreateRequest;
import supmeal_backend.dto.response.FavoriteRecipeResponse;
import supmeal_backend.entity.FavoriteRecipe;
import supmeal_backend.entity.Recipe;
import supmeal_backend.entity.User;
import supmeal_backend.exception.ResourceNotFoundException;
import supmeal_backend.mapper.FavoriteRecipeMapper;
import supmeal_backend.service.FavoriteRecipeService;
import supmeal_backend.service.RecipeService;
import supmeal_backend.service.UserService;

import jakarta.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/favorites")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class FavoriteRecipeController {

    private final FavoriteRecipeService favoriteRecipeService;
    private final FavoriteRecipeMapper favoriteRecipeMapper;
    private final UserService userService;
    private final RecipeService recipeService;

    @GetMapping
    public ResponseEntity<List<Long>> getAllFavorites(@RequestHeader(value = "X-User-Id", required = false) String userIdHeader) {
        // Utiliser l'userId du header ou une valeur par défaut pour le développement
        Long userId = userIdHeader != null ? Long.parseLong(userIdHeader) : 10L;
        
        User user = userService.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("User not found with id: %d", userId)));
        
        List<FavoriteRecipe> favorites = favoriteRecipeService.findByUser(user);
        List<Long> recipeIds = favorites.stream()
                .map(f -> f.getRecipe().getId())
                .collect(Collectors.toList());
        return ResponseEntity.ok(recipeIds);
    }

    @PostMapping
    public ResponseEntity<FavoriteRecipeResponse> addFavorite(
            @Valid @RequestBody FavoriteRecipeCreateRequest request,
            @RequestHeader(value = "X-User-Id", required = false) String userIdHeader) {
        // Utiliser l'userId du header ou une valeur par défaut pour le développement
        Long userId = userIdHeader != null ? Long.parseLong(userIdHeader) : 10L;
        
        User user = userService.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("User not found with id: %d", userId)));
        
        Recipe recipe = recipeService.findById(request.getRecipeId())
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Recipe not found with id: %d", request.getRecipeId())));
        
        // Check if already exists
        if (favoriteRecipeService.existsByUserAndRecipe(user, recipe)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
        
        FavoriteRecipe favoriteRecipe = FavoriteRecipe.builder()
                .user(user)
                .recipe(recipe)
                .build();
        
        FavoriteRecipe savedFavorite = favoriteRecipeService.save(favoriteRecipe);
        return new ResponseEntity<>(favoriteRecipeMapper.toResponse(savedFavorite), HttpStatus.CREATED);
    }

    @DeleteMapping("/{recipeId}")
    public ResponseEntity<Void> removeFavorite(
            @PathVariable Long recipeId,
            @RequestHeader(value = "X-User-Id", required = false) String userIdHeader) {
        // Utiliser l'userId du header ou une valeur par défaut pour le développement
        Long userId = userIdHeader != null ? Long.parseLong(userIdHeader) : 10L;
        
        User user = userService.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("User not found with id: %d", userId)));
        
        Recipe recipe = recipeService.findById(recipeId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Recipe not found with id: %d", recipeId)));
        
        FavoriteRecipe favorite = favoriteRecipeService.findByUserAndRecipe(user, recipe)
                .orElseThrow(() -> new ResourceNotFoundException("Favorite not found"));
        
        favoriteRecipeService.delete(favorite.getId());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{recipeId}/check")
    public ResponseEntity<Boolean> isFavorite(
            @PathVariable Long recipeId,
            @RequestHeader(value = "X-User-Id", required = false) String userIdHeader) {
        // Utiliser l'userId du header ou une valeur par défaut pour le développement
        Long userId = userIdHeader != null ? Long.parseLong(userIdHeader) : 10L;
        
        User user = userService.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("User not found with id: %d", userId)));
        
        Recipe recipe = recipeService.findById(recipeId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Recipe not found with id: %d", recipeId)));
        
        boolean isFavorite = favoriteRecipeService.existsByUserAndRecipe(user, recipe);
        return ResponseEntity.ok(isFavorite);
    }
}
