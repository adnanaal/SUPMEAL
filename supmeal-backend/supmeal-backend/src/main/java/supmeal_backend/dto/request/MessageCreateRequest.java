package supmeal_backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageCreateRequest {

    @NotBlank(message = "Message content is required")
    @Size(max = 2000, message = "Message content must not exceed 2000 characters")
    private String content;

    @NotNull(message = "Receiver ID is required")
    private Long receiverId;

    @NotNull(message = "Cookbook ID is required")
    private Long cookbookId;
}
