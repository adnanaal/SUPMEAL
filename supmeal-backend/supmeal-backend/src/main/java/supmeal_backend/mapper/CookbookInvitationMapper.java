package supmeal_backend.mapper;

import org.springframework.stereotype.Component;
import supmeal_backend.dto.request.CookbookInvitationCreateRequest;
import supmeal_backend.dto.response.CookbookInvitationResponse;
import supmeal_backend.entity.CookbookInvitation;

@Component
public class CookbookInvitationMapper {

    public CookbookInvitationResponse toResponse(CookbookInvitation invitation) {
        if (invitation == null) {
            return null;
        }
        return CookbookInvitationResponse.builder()
                .id(invitation.getId())
                .status(invitation.getStatus())
                .sentAt(invitation.getSentAt())
                .senderId(invitation.getSender() != null ? invitation.getSender().getId() : null)
                .receiverId(invitation.getReceiver() != null ? invitation.getReceiver().getId() : null)
                .cookbookId(invitation.getCookbook() != null ? invitation.getCookbook().getId() : null)
                .build();
    }

    public CookbookInvitation toEntity(CookbookInvitationCreateRequest request) {
        if (request == null) {
            return null;
        }
        return CookbookInvitation.builder()
                .build();
    }
}
