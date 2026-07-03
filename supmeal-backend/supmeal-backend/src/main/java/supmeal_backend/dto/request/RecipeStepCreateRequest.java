package supmeal_backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecipeStepCreateRequest {

    @NotNull(message = "Step order is required")
    @Positive(message = "Step order must be positive")
    private Integer stepOrder;

    @NotBlank(message = "Instruction is required")
    private String instruction;

    @NotNull(message = "Recipe ID is required")
    private Long recipeId;
}
