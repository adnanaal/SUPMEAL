package supmeal_backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import supmeal_backend.dto.request.MealPlanningCreateRequest;
import supmeal_backend.dto.request.MealPlanningUpdateRequest;
import supmeal_backend.dto.response.MealPlanningResponse;
import supmeal_backend.entity.MealPlanning;
import supmeal_backend.entity.Recipe;
import supmeal_backend.entity.User;
import supmeal_backend.exception.ResourceNotFoundException;
import supmeal_backend.mapper.MealPlanningMapper;
import supmeal_backend.service.MealPlanningService;
import supmeal_backend.service.RecipeService;
import supmeal_backend.service.UserService;

import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/meal-planning")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MealPlanningController {

    private final MealPlanningService mealPlanningService;
    private final MealPlanningMapper mealPlanningMapper;
    private final UserService userService;
    private final RecipeService recipeService;

    @PostMapping
    public ResponseEntity<MealPlanningResponse> createMealPlanning(
            @Valid @RequestBody MealPlanningCreateRequest request,
            @RequestHeader(value = "X-User-Id", required = false) String userIdHeader) {
        // Utiliser l'userId du header ou une valeur par défaut pour le développement
        Long userId = userIdHeader != null ? Long.parseLong(userIdHeader) : 10L;
        
        User user = userService.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("User not found with id: %d", userId)));
        
        MealPlanning mealPlanning = mealPlanningMapper.toEntity(request);
        mealPlanning.setUser(user);
        MealPlanning savedMealPlanning = mealPlanningService.save(mealPlanning);
        return new ResponseEntity<>(mealPlanningMapper.toResponse(savedMealPlanning), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<MealPlanningResponse>> getAllMealPlannings(@RequestHeader(value = "X-User-Id", required = false) String userIdHeader) {
        // Utiliser l'userId du header ou une valeur par défaut pour le développement
        Long userId = userIdHeader != null ? Long.parseLong(userIdHeader) : 10L;
        
        List<MealPlanning> mealPlannings = mealPlanningService.findAll();
        List<MealPlanningResponse> responses = mealPlannings.stream()
                .filter(m -> m.getUser() != null && m.getUser().getId().equals(userId))
                .map(mealPlanningMapper::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MealPlanningResponse> getMealPlanningById(@PathVariable Long id) {
        MealPlanning mealPlanning = mealPlanningService.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("MealPlanning not found with id: %d", id)));
        return ResponseEntity.ok(mealPlanningMapper.toResponse(mealPlanning));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<MealPlanningResponse>> getMealPlanningsByUser(@PathVariable Long userId) {
        List<MealPlanning> mealPlannings = mealPlanningService.findAll();
        List<MealPlanningResponse> responses = mealPlannings.stream()
                .filter(m -> m.getUser() != null && m.getUser().getId().equals(userId))
                .map(mealPlanningMapper::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/user/{userId}/date/{date}")
    public ResponseEntity<List<MealPlanningResponse>> getMealPlanningsByUserAndDate(
            @PathVariable Long userId,
            @PathVariable LocalDate date) {
        List<MealPlanning> mealPlannings = mealPlanningService.findAll();
        List<MealPlanningResponse> responses = mealPlannings.stream()
                .filter(m -> m.getUser() != null && m.getUser().getId().equals(userId))
                .filter(m -> m.getPlannedDate().equals(date))
                .map(mealPlanningMapper::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MealPlanningResponse> updateMealPlanning(@PathVariable Long id, @Valid @RequestBody MealPlanningUpdateRequest request) {
        MealPlanning existingMealPlanning = mealPlanningService.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("MealPlanning not found with id: %d", id)));
        
        if (request.getPlannedDate() != null) {
            existingMealPlanning.setPlannedDate(request.getPlannedDate());
        }
        if (request.getMealType() != null) {
            existingMealPlanning.setMealType(request.getMealType());
        }
        // Only update recipe if recipeId is explicitly set in the request
        if (request.getRecipeId() != null) {
            Recipe recipe = recipeService.findById(request.getRecipeId())
                    .orElseThrow(() -> new ResourceNotFoundException(String.format("Recipe not found with id: %d", request.getRecipeId())));
            existingMealPlanning.setRecipe(recipe);
        }
        
        MealPlanning updatedMealPlanning = mealPlanningService.update(existingMealPlanning);
        return ResponseEntity.ok(mealPlanningMapper.toResponse(updatedMealPlanning));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMealPlanning(@PathVariable Long id) {
        MealPlanning mealPlanning = mealPlanningService.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(String.format("MealPlanning not found with id: %d", id)));
        mealPlanningService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
