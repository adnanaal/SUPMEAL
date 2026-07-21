package supmeal_backend.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import supmeal_backend.entity.CookbookPermission;
import supmeal_backend.entity.enums.InvitationStatus;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CookbookInvitationResponse {

    private Long id;

    private InvitationStatus status;

    private CookbookPermission permission;

    private Long senderId;
    private String senderName;

    private Long receiverId;
    private String receiverName;

    private Long cookbookId;
    private String cookbookName;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime sentAt;
}
