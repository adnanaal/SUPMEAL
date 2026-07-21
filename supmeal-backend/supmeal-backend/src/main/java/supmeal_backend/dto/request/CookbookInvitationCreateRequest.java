package supmeal_backend.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import supmeal_backend.entity.CookbookPermission;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CookbookInvitationCreateRequest {

    @NotNull(message = "Receiver ID is required")
    private Long receiverId;

    @NotNull(message = "Cookbook ID is required")
    private Long cookbookId;

    @NotNull(message = "Permission is required")
    private CookbookPermission permission;
}
