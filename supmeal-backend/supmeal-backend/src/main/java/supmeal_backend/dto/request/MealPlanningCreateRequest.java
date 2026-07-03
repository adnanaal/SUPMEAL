package supmeal_backend.dto.request;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
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
public class MealPlanningCreateRequest {

    @NotNull(message = "Planned date is required")
    @FutureOrPresent(message = "Planned date must be today or in the future")
    private LocalDate plannedDate;

    @NotNull(message = "Meal type is required")
    private MealType mealType;

    @NotNull(message = "Recipe ID is required")
    private Long recipeId;
}
