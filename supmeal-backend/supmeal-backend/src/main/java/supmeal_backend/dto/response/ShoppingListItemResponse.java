package supmeal_backend.dto.response;

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
public class ShoppingListItemResponse {

    private Long id;

    private Long shoppingListId;

    private String ingredientName;

    private String quantity;

    private String unit;

    private Boolean checked;

    private Long sourceMealPlanId;

    private String sourceRecipeTitle;

    private MealType sourceMealType;

    private LocalDate sourceDate;
}
