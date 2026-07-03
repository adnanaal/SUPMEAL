package supmeal_backend.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CookbookMemberCreateRequest {

    @NotNull(message = "Cookbook ID is required")
    private Long cookbookId;
}
