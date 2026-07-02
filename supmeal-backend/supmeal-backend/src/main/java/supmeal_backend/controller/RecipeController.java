package supmeal_backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import supmeal_backend.dto.RecipeDTO;
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
    public ResponseEntity<RecipeDTO> createRecipe(@Valid @RequestBody RecipeDTO recipeDTO) {
        Recipe recipe = recipeMapper.toEntity(recipeDTO);
        Recipe savedRecipe = recipeService.save(recipe);
        return new ResponseEntity<>(recipeMapper.toDTO(savedRecipe), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<RecipeDTO>> getAllRecipes() {
        List<Recipe> recipes = recipeService.findAll();
        List<RecipeDTO> recipeDTOs = recipes.stream()
                .map(recipeMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(recipeDTOs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RecipeDTO> getRecipeById(@PathVariable Long id) {
        Recipe recipe = recipeService.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Recipe", id));
        return ResponseEntity.ok(recipeMapper.toDTO(recipe));
    }

    @GetMapping("/search")
    public ResponseEntity<List<RecipeDTO>> searchRecipes(@RequestParam String title) {
        List<Recipe> recipes = recipeService.findByTitleContainingIgnoreCase(title);
        List<RecipeDTO> recipeDTOs = recipes.stream()
                .map(recipeMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(recipeDTOs);
    }

    @GetMapping("/owner/{ownerId}")
    public ResponseEntity<List<RecipeDTO>> getRecipesByOwner(@PathVariable Long ownerId) {
        // Note: This would need User entity, simplified for now
        List<Recipe> recipes = recipeService.findAll();
        List<RecipeDTO> recipeDTOs = recipes.stream()
                .filter(r -> r.getOwner() != null && r.getOwner().getId().equals(ownerId))
                .map(recipeMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(recipeDTOs);
    }

    @GetMapping("/meal-type/{mealType}")
    public ResponseEntity<List<RecipeDTO>> getRecipesByMealType(@PathVariable String mealType) {
        List<Recipe> recipes = recipeService.findByMealType(
                supmeal_backend.entity.enums.MealType.valueOf(mealType.toUpperCase())
        );
        List<RecipeDTO> recipeDTOs = recipes.stream()
                .map(recipeMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(recipeDTOs);
    }

    @PutMapping("/{id}")
    public ResponseEntity<RecipeDTO> updateRecipe(@PathVariable Long id, @Valid @RequestBody RecipeDTO recipeDTO) {
        Recipe existingRecipe = recipeService.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Recipe", id));
        
        Recipe recipe = recipeMapper.toEntity(recipeDTO);
        recipe.setId(id);
        Recipe updatedRecipe = recipeService.update(recipe);
        return ResponseEntity.ok(recipeMapper.toDTO(updatedRecipe));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRecipe(@PathVariable Long id) {
        Recipe recipe = recipeService.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Recipe", id));
        recipeService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
