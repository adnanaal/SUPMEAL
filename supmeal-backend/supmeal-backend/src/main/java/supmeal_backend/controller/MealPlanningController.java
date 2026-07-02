package supmeal_backend.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import supmeal_backend.dto.MealPlanningDTO;
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
    public ResponseEntity<MealPlanningDTO> createMealPlanning(@Valid @RequestBody MealPlanningDTO mealPlanningDTO) {
        MealPlanning mealPlanning = mealPlanningMapper.toEntity(mealPlanningDTO);
        MealPlanning savedMealPlanning = mealPlanningService.save(mealPlanning);
        return new ResponseEntity<>(mealPlanningMapper.toDTO(savedMealPlanning), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<MealPlanningDTO>> getAllMealPlannings() {
        List<MealPlanning> mealPlannings = mealPlanningService.findAll();
        List<MealPlanningDTO> mealPlanningDTOs = mealPlannings.stream()
                .map(mealPlanningMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(mealPlanningDTOs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MealPlanningDTO> getMealPlanningById(@PathVariable Long id) {
        MealPlanning mealPlanning = mealPlanningService.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("MealPlanning", id));
        return ResponseEntity.ok(mealPlanningMapper.toDTO(mealPlanning));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<MealPlanningDTO>> getMealPlanningsByUser(@PathVariable Long userId) {
        List<MealPlanning> mealPlannings = mealPlanningService.findAll();
        List<MealPlanningDTO> mealPlanningDTOs = mealPlannings.stream()
                .filter(m -> m.getUser() != null && m.getUser().getId().equals(userId))
                .map(mealPlanningMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(mealPlanningDTOs);
    }

    @GetMapping("/user/{userId}/date/{date}")
    public ResponseEntity<List<MealPlanningDTO>> getMealPlanningsByUserAndDate(
            @PathVariable Long userId,
            @PathVariable LocalDate date) {
        List<MealPlanning> mealPlannings = mealPlanningService.findAll();
        List<MealPlanningDTO> mealPlanningDTOs = mealPlannings.stream()
                .filter(m -> m.getUser() != null && m.getUser().getId().equals(userId))
                .filter(m -> m.getPlannedDate().equals(date))
                .map(mealPlanningMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(mealPlanningDTOs);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MealPlanningDTO> updateMealPlanning(@PathVariable Long id, @Valid @RequestBody MealPlanningDTO mealPlanningDTO) {
        MealPlanning existingMealPlanning = mealPlanningService.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("MealPlanning", id));
        
        MealPlanning mealPlanning = mealPlanningMapper.toEntity(mealPlanningDTO);
        mealPlanning.setId(id);
        MealPlanning updatedMealPlanning = mealPlanningService.update(mealPlanning);
        return ResponseEntity.ok(mealPlanningMapper.toDTO(updatedMealPlanning));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMealPlanning(@PathVariable Long id) {
        MealPlanning mealPlanning = mealPlanningService.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("MealPlanning", id));
        mealPlanningService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
