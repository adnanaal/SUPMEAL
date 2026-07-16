package supmeal_backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import supmeal_backend.dto.request.RecipeCreateRequest;
import supmeal_backend.dto.request.RecipeUpdateRequest;
import supmeal_backend.dto.response.RecipeResponse;
import supmeal_backend.entity.Ingredient;
import supmeal_backend.entity.Recipe;
import supmeal_backend.entity.RecipeStep;
import supmeal_backend.entity.Tag;
import supmeal_backend.entity.User;
import supmeal_backend.exception.ResourceNotFoundException;
import supmeal_backend.mapper.RecipeMapper;
import supmeal_backend.repository.TagRepository;
import supmeal_backend.service.RecipeService;
import supmeal_backend.service.UserService;

import jakarta.validation.Valid;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/recipes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RecipeController {

    private final RecipeService recipeService;
    private final RecipeMapper recipeMapper;
    private final UserService userService;
    private final TagRepository tagRepository;

    @PostMapping
    @Transactional
    public ResponseEntity<RecipeResponse> createRecipe(@Valid @RequestBody RecipeCreateRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User owner = userService.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("User not found with email: %s", email)));
        
        Recipe recipe = recipeMapper.toEntity(request);
        recipe.setOwner(owner);
        
        // Gérer les tags : réutiliser les existants ou créer des nouveaux
        if (request.getTags() != null && !request.getTags().isEmpty()) {
            List<Tag> tags = new ArrayList<>();
            for (String tagName : request.getTags()) {
                if (tagName != null && !tagName.trim().isEmpty()) {
                    Tag tag = tagRepository.findByName(tagName).orElse(null);
                    if (tag == null) {
                        tag = Tag.builder()
                                .name(tagName)
                                .build();
                    }
                    tags.add(tag);
                }
            }
            recipe.setTags(tags);
        }
        
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

    @PostMapping("/import")
    public ResponseEntity<RecipeResponse> importFromUrl(@RequestBody Map<String, Object> request) {
        String url = (String) request.get("url");
        String title = (String) request.get("title");
        String mealTypeStr = (String) request.get("mealType");
        
        if (url == null || url.trim().isEmpty()) {
            throw new IllegalArgumentException("URL is required");
        }
        
        // Pour l'instant, créer une recette avec des données par défaut
        // TODO: Implémenter un vrai scraper de recettes
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User owner = userService.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("User not found with email: %s", email)));
        
        // Image statique pour les recettes importées
        String staticImportedImage = "https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800&h=600&fit=crop";
        
        // Utiliser le titre fourni ou un titre par défaut
        String recipeTitle = (title != null && !title.trim().isEmpty()) ? title : "Imported Recipe";
        
        // Utiliser le mealType fourni ou DINNER par défaut
        supmeal_backend.entity.enums.MealType recipeMealType = supmeal_backend.entity.enums.MealType.DINNER;
        if (mealTypeStr != null && !mealTypeStr.trim().isEmpty()) {
            try {
                recipeMealType = supmeal_backend.entity.enums.MealType.valueOf(mealTypeStr.toUpperCase());
            } catch (IllegalArgumentException e) {
                // Si le mealType est invalide, utiliser DINNER par défaut
            }
        }
        
        Recipe recipe = Recipe.builder()
                .title(recipeTitle)
                .description("Recipe imported from: " + url)
                .mealType(recipeMealType)
                .imagePath(staticImportedImage)
                .sourceUrl(url)
                .owner(owner)
                .build();
        
        Recipe savedRecipe = recipeService.save(recipe);
        return new ResponseEntity<>(recipeMapper.toResponse(savedRecipe), HttpStatus.CREATED);
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
        
        // Gérer les ingredients : supprimer anciens, recréer nouveaux
        if (existingRecipe.getIngredients() != null) {
            existingRecipe.getIngredients().clear();
        } else {
            existingRecipe.setIngredients(new ArrayList<>());
        }
        if (request.getIngredients() != null && !request.getIngredients().isEmpty()) {
            List<Ingredient> newIngredients = new ArrayList<>();
            for (int i = 0; i < request.getIngredients().size(); i++) {
                Ingredient ingredient = Ingredient.builder()
                        .name(request.getIngredients().get(i))
                        .quantity(1.0)
                        .unit("unit")
                        .recipe(existingRecipe)
                        .build();
                newIngredients.add(ingredient);
            }
            existingRecipe.getIngredients().addAll(newIngredients);
        }
        
        // Gérer les steps : supprimer anciens, recréer nouveaux
        if (existingRecipe.getSteps() != null) {
            existingRecipe.getSteps().clear();
        } else {
            existingRecipe.setSteps(new ArrayList<>());
        }
        if (request.getSteps() != null && !request.getSteps().isEmpty()) {
            List<RecipeStep> newSteps = new ArrayList<>();
            for (int i = 0; i < request.getSteps().size(); i++) {
                RecipeStep step = RecipeStep.builder()
                        .stepOrder(i + 1)
                        .instruction(request.getSteps().get(i))
                        .recipe(existingRecipe)
                        .build();
                newSteps.add(step);
            }
            existingRecipe.getSteps().addAll(newSteps);
        }
        
        // Gérer les tags : gestion manuelle des différences
        if (request.getTags() != null) {
            // Tags actuels de la recette
            List<Tag> currentTags = existingRecipe.getTags();
            List<String> currentTagNames = currentTags.stream()
                    .map(Tag::getName)
                    .toList();
            
            // Tags demandés (filtrés)
            List<String> requestedTagNames = request.getTags().stream()
                    .filter(tagName -> tagName != null && !tagName.trim().isEmpty())
                    .toList();
            
            // Supprimer les tags qui ne sont plus demandés
            currentTags.removeIf(tag -> !requestedTagNames.contains(tag.getName()));
            
            // Ajouter les nouveaux tags demandés
            for (String tagName : requestedTagNames) {
                if (!currentTagNames.contains(tagName)) {
                    Tag tag = tagRepository.findByName(tagName).orElse(null);
                    if (tag == null) {
                        tag = Tag.builder()
                                .name(tagName)
                                .build();
                    }
                    existingRecipe.getTags().add(tag);
                }
            }
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
