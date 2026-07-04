package supmeal_backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import supmeal_backend.dto.request.MealPlanningCreateRequest;
import supmeal_backend.dto.request.MealPlanningUpdateRequest;
import supmeal_backend.dto.response.MealPlanningResponse;
import supmeal_backend.entity.MealPlanning;
import supmeal_backend.exception.ResourceNotFoundException;
import supmeal_backend.mapper.MealPlanningMapper;
import supmeal_backend.service.MealPlanningService;

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

    @PostMapping
    public ResponseEntity<MealPlanningResponse> createMealPlanning(@Valid @RequestBody MealPlanningCreateRequest request) {
        MealPlanning mealPlanning = mealPlanningMapper.toEntity(request);
        MealPlanning savedMealPlanning = mealPlanningService.save(mealPlanning);
        return new ResponseEntity<>(mealPlanningMapper.toResponse(savedMealPlanning), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<MealPlanningResponse>> getAllMealPlannings() {
        List<MealPlanning> mealPlannings = mealPlanningService.findAll();
        List<MealPlanningResponse> responses = mealPlannings.stream()
                .map(mealPlanningMapper::toResponse)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MealPlanningResponse> getMealPlanningById(@PathVariable Long id) {
        MealPlanning mealPlanning = mealPlanningService.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("MealPlanning", id));
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
                .orElseThrow(() -> new ResourceNotFoundException("MealPlanning", id));
        
        MealPlanning mealPlanning = mealPlanningMapper.toEntity(request);
        mealPlanning.setId(id);
        MealPlanning updatedMealPlanning = mealPlanningService.update(mealPlanning);
        return ResponseEntity.ok(mealPlanningMapper.toResponse(updatedMealPlanning));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMealPlanning(@PathVariable Long id) {
        MealPlanning mealPlanning = mealPlanningService.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("MealPlanning", id));
        mealPlanningService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
