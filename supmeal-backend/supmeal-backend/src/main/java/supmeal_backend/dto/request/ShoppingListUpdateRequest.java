package supmeal_backend.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShoppingListUpdateRequest {

    private String name;

    private String description;

    private List<Long> mealPlanIds;
}
