package supmeal_backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import supmeal_backend.dto.request.RecipeCreateRequest;
import supmeal_backend.dto.request.RecipeUpdateRequest;
import supmeal_backend.dto.response.RecipeResponse;
import supmeal_backend.entity.Recipe;
import supmeal_backend.exception.ResourceNotFoundException;
import supmeal_backend.mapper.RecipeMapper;
import supmeal_backend.service.RecipeService;

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

    @PostMapping
    public ResponseEntity<RecipeResponse> createRecipe(@Valid @RequestBody RecipeCreateRequest request) {
        Recipe recipe = recipeMapper.toEntity(request);
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
        
        Recipe recipe = recipeMapper.toEntity(request);
        recipe.setId(id);
        Recipe updatedRecipe = recipeService.update(recipe);
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
