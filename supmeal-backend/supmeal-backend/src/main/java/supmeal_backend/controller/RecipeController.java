package supmeal_backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import supmeal_backend.dto.request.RecipeCreateRequest;
import supmeal_backend.dto.request.RecipeUpdateRequest;
import supmeal_backend.dto.response.RecipeResponse;
import supmeal_backend.entity.Recipe;
import supmeal_backend.entity.User;
import supmeal_backend.exception.ResourceNotFoundException;
import supmeal_backend.mapper.RecipeMapper;
import supmeal_backend.service.RecipeService;
import supmeal_backend.service.UserService;

import jakarta.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/recipes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RecipeController {

    private final RecipeService recipeService;
    private final RecipeMapper recipeMapper;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<RecipeResponse> createRecipe(@Valid @RequestBody RecipeCreateRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User owner = userService.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("User not found with email: %s", email)));
        
        Recipe recipe = recipeMapper.toEntity(request);
        recipe.setOwner(owner);
        Recipe savedRecipe = recipeService.save(recipe);
        return new ResponseEntity<>(recipeMapper.toResponse(savedRecipe), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<RecipeResponse>> getAllRecipes() {
        List<Recipe> recipes = recipeService.findAll();
        List<RecipeResponse> responses = recipes.stream()
                .map(recipeMapper::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RecipeResponse> getRecipeById(@PathVariable Long id) {
        Recipe recipe = recipeService.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Recipe not found with id: %d", id)));
        return ResponseEntity.ok(recipeMapper.toResponse(recipe));
    }

    @GetMapping("/search")
    public ResponseEntity<List<RecipeResponse>> searchRecipes(@RequestParam String title) {
        List<Recipe> recipes = recipeService.findByTitleContainingIgnoreCase(title);
        List<RecipeResponse> responses = recipes.stream()
                .map(recipeMapper::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<List<RecipeResponse>> getRecipesByOwner(@PathVariable Long ownerId) {
        List<Recipe> recipes = recipeService.findAll();
        List<RecipeResponse> responses = recipes.stream()
                .filter(r -> r.getOwner() != null && r.getOwner().getId().equals(ownerId))
                .map(recipeMapper::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/meal-type/{mealType}")
    public ResponseEntity<List<RecipeResponse>> getRecipesByMealType(@PathVariable String mealType) {
        List<Recipe> recipes = recipeService.findByMealType(
                supmeal_backend.entity.enums.MealType.valueOf(mealType.toUpperCase())
        );
        List<RecipeResponse> responses = recipes.stream()
                .map(recipeMapper::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @PutMapping("/{id}")
    public ResponseEntity<RecipeResponse> updateRecipe(@PathVariable Long id, @Valid @RequestBody RecipeUpdateRequest request) {
        Recipe existingRecipe = recipeService.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Recipe not found with id: %d", id)));
        
        if (request.getTitle() != null) {
            existingRecipe.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            existingRecipe.setDescription(request.getDescription());
        }
        if (request.getPreparationTime() != null) {
            existingRecipe.setPreparationTime(request.getPreparationTime());
        }
        if (request.getCookingTime() != null) {
            existingRecipe.setCookingTime(request.getCookingTime());
        }
        if (request.getServings() != null) {
            existingRecipe.setServings(request.getServings());
        }
        if (request.getImagePath() != null) {
            existingRecipe.setImagePath(request.getImagePath());
        }
        if (request.getSource() != null) {
            existingRecipe.setSource(request.getSource());
        }
        if (request.getMealType() != null) {
            existingRecipe.setMealType(request.getMealType());
        }
        if (request.getIngredients() != null) {
            existingRecipe.setIngredients(request.getIngredients());
        }
        if (request.getSteps() != null) {
            existingRecipe.setSteps(request.getSteps());
        }
        if (request.getTags() != null) {
            existingRecipe.setTags(request.getTags());
        }
        
        Recipe updatedRecipe = recipeService.update(existingRecipe);
        return ResponseEntity.ok(recipeMapper.toResponse(updatedRecipe));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRecipe(@PathVariable Long id) {
        Recipe recipe = recipeService.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("Recipe not found with id: %d", id)));
        recipeService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
