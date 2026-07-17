package supmeal_backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
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
public class ShoppingListItemCreateRequest {

    @NotNull(message = "Shopping list ID is required")
    private Long shoppingListId;

    @NotBlank(message = "Ingredient name is required")
    private String ingredientName;

    @NotBlank(message = "Quantity is required")
    private String quantity;

    @NotBlank(message = "Unit is required")
    private String unit;

    @Builder.Default
    private Boolean checked = false;

    private Long sourceMealPlanId;

    private String sourceRecipeTitle;

    private MealType sourceMealType;

    private LocalDate sourceDate;
}
