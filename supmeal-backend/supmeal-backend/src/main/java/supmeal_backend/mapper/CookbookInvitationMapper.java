package supmeal_backend.mapper;

import org.springframework.stereotype.Component;
import supmeal_backend.dto.CookbookInvitationDTO;
import supmeal_backend.entity.CookbookInvitation;

@Component
public class CookbookInvitationMapper {

    public CookbookInvitationDTO toDTO(CookbookInvitation invitation) {
        if (invitation == null) {
            return null;
        }
        return CookbookInvitationDTO.builder()
                .id(invitation.getId())
                .status(invitation.getStatus())
                .sentAt(invitation.getSentAt())
                .senderId(invitation.getSender() != null ? invitation.getSender().getId() : null)
                .receiverId(invitation.getReceiver() != null ? invitation.getReceiver().getId() : null)
                .cookbookId(invitation.getCookbook() != null ? invitation.getCookbook().getId() : null)
                .build();
    }

    public CookbookInvitation toEntity(CookbookInvitationDTO invitationDTO) {
        if (invitationDTO == null) {
            return null;
        }
        return CookbookInvitation.builder()
                .id(invitationDTO.getId())
                .status(invitationDTO.getStatus())
                .sentAt(invitationDTO.getSentAt())
                .build();
    }
}
