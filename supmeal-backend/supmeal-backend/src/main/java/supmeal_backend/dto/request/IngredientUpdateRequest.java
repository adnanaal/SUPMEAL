package supmeal_backend.dto.request;

import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IngredientUpdateRequest {

    private String name;

    @Positive(message = "Quantity must be positive")
    private Double quantity;

    private String unit;
}
