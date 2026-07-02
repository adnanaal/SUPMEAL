package supmeal_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import supmeal_backend.entity.enums.MealType;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MealPlanningDTO {
    private Long id;
    private LocalDate plannedDate;
    private MealType mealType;
    private LocalDateTime createdAt;
    private Long userId;
    private Long recipeId;
}
