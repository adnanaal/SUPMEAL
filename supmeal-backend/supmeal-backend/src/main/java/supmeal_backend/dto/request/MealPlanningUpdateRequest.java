package supmeal_backend.dto.request;

import jakarta.validation.constraints.FutureOrPresent;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import supmeal_backend.entity.enums.MealType;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MealPlanningUpdateRequest {

    @FutureOrPresent(message = "Planned date must be today or in the future")
    private LocalDate plannedDate;

    private MealType mealType;

    private Long recipeId;
}
