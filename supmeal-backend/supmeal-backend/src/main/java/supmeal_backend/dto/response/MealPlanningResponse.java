package supmeal_backend.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import supmeal_backend.entity.enums.MealType;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MealPlanningResponse {

    private Long id;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private java.time.LocalDate plannedDate;

    private MealType mealType;

    private Long userId;

    private Long recipeId;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;
}
