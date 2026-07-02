package supmeal_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import supmeal_backend.entity.enums.InvitationStatus;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CookbookInvitationDTO {
    private Long id;
    private InvitationStatus status;
    private LocalDateTime sentAt;
    private Long senderId;
    private Long receiverId;
    private Long cookbookId;
}
