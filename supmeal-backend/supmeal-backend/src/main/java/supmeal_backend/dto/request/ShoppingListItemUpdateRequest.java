package supmeal_backend.dto.request;

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
public class ShoppingListItemUpdateRequest {

    private String ingredientName;

    private String quantity;

    private String unit;

    private Boolean checked;
}
