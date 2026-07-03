package supmeal_backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecipeStepResponse {

    private Long id;

    private Integer stepOrder;

    private String instruction;

    private Long recipeId;
}
